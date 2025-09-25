"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Save, Send, Calendar, Phone, MapPin } from "lucide-react"
import {
  getTenantProfile,
  addMaintenanceRequest,
  getRequestDraft,
  setRequestDraft,
  generateMaintenanceRequestId,
  addTenantTicket,
} from "@/lib/storage"
import { calculatePriority } from "@/lib/priority"
import { generateTicketId } from "@/lib/id"
import PhotoUploader from "@/components/photo-uploader"
import PriorityBadge from "@/components/priority-badge"

const requestSchema = z.object({
  property: z.string().min(1, "Property is required"),
  building: z.string().optional(),
  floor: z.number().min(1, "Floor number is required"),
  unit: z.string().min(1, "Unit/Room number is required"),
  requestType: z.enum([
    "Room Maintenance",
    "Building Maintenance",
    "Incident Report",
    "Service Request",
    "Visitor Access / Delivery",
  ]),
  category: z.string().min(1, "Category is required"),
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters") // reduced from 50 to 10 characters
    .max(1000, "Description must be 1000 characters or less"),
  preferredDate: z.string().optional(),
  preferredTimeRange: z.string().optional(),
  accessInstructions: z.string().optional(),
  contactPhone: z
    .string()
    .min(1, "Contact phone is required")
    .refine((phone) => {
      // Remove all non-digit characters for validation
      const digitsOnly = phone.replace(/\D/g, "")
      // Accept phone numbers with 7-15 digits (covers most international formats)
      return digitsOnly.length >= 7 && digitsOnly.length <= 15
    }, "Please enter a valid phone number (7-15 digits)"),
  photos: z.array(z.string()).max(5, "Maximum 5 photos allowed"),
})

type RequestFormData = z.infer<typeof requestSchema>

const categoryOptions = {
  "Room Maintenance": ["Electrical", "Plumbing", "AC", "Appliance", "Other"],
  "Building Maintenance": ["Elevator", "Hallway", "Lobby", "Parking", "Other"],
  "Incident Report": ["Water Leak", "Gas Smell", "Fire", "Security", "Injury", "Other"],
  "Service Request": ["Cleaning", "Pest Control", "Handyman", "Move-in/out", "Other"],
  "Visitor Access / Delivery": ["Courier", "Food", "Guest", "Large Item", "Other"],
}

const timeRanges = [
  "08:00-12:00",
  "12:00-16:00",
  "16:00-20:00",
  "08:00-17:00",
  "09:00-18:00",
  "Flexible",
  "Emergency - ASAP",
]

interface RequestFormProps {
  initialType?: string
}

export default function RequestForm({ initialType }: RequestFormProps) {
  const [photos, setPhotos] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calculatedPriority, setCalculatedPriority] = useState<"Low" | "Medium" | "High" | "Critical">("Medium")
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      photos: [],
    },
  })

  const watchedValues = watch()
  const requestType = watch("requestType")
  const title = watch("title")
  const description = watch("description")
  const category = watch("category")

  // Load draft on mount and set initial type
  useEffect(() => {
    const draft = getRequestDraft()
    const profile = getTenantProfile()

    if (draft) {
      Object.entries(draft).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof RequestFormData, value as any)
        }
      })
      if (draft.photos) {
        setPhotos(draft.photos)
        setValue("photos", draft.photos)
      }
    }

    if (initialType) {
      const typeMapping = {
        maintenance: "Room Maintenance",
        incident: "Incident Report",
        service: "Service Request",
        visitor: "Visitor Access / Delivery",
      }
      const mappedType = typeMapping[initialType as keyof typeof typeMapping]
      if (mappedType) {
        setValue("requestType", mappedType as any)
      }
    }

    // Pre-fill tenant info
    if (profile) {
      setValue("unit", profile.unitNo)
      setValue("floor", Number.parseInt(profile.floor) || 1)
    }
  }, [setValue, initialType])

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(watchedValues).length > 0) {
        setRequestDraft({
          ...watchedValues,
          photos,
        })
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [watchedValues, photos])

  // Calculate priority when relevant fields change
  useEffect(() => {
    if (requestType && title && description) {
      const priority = calculatePriority({
        requestType,
        title,
        description,
        category: category || "",
        photoCount: photos.length,
      })
      setCalculatedPriority(priority)
    }
  }, [requestType, title, description, category, photos.length])

  const handleSaveDraft = () => {
    setRequestDraft({
      ...watchedValues,
      photos,
    })
    toast({
      title: "Draft Saved",
      description: "Your request has been saved as a draft.",
    })
  }

  const onSubmit = async (data: RequestFormData) => {
    setIsSubmitting(true)

    try {
      const profile = getTenantProfile()
      if (!profile) {
        throw new Error("Please log in again")
      }

      const requestTypeMapping = {
        "Room Maintenance": "maintenance",
        "Building Maintenance": "maintenance",
        "Incident Report": "incident",
        "Service Request": "service",
        "Visitor Access / Delivery": "visitor",
      }

      const mappedRequestType = requestTypeMapping[data.requestType as keyof typeof requestTypeMapping] || "maintenance"
      const requestId = generateMaintenanceRequestId(mappedRequestType)

      // Create maintenance request object
      const maintenanceRequest = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        requestId,
        tenantId: `tenant_${profile.email}`, // Use email as tenant identifier
        tenantEmail: profile.email,
        tenantName: `${profile.firstName} ${profile.lastName}`,
        unitNumber: data.unit,
        building: data.building || profile.building,
        requestType: mappedRequestType as "maintenance" | "incident" | "service" | "visitor",
        category: data.category,
        title: data.title,
        description: data.description,
        priority: calculatedPriority.toLowerCase() as "low" | "medium" | "high" | "urgent",
        status: "submitted" as const,
        location: `${data.building || profile.building}, Floor ${data.floor}, Unit ${data.unit}`,
        preferredTime: data.preferredTimeRange,
        preferredDate: data.preferredDate,
        photos: photos,
        contactPhone: data.contactPhone,
        accessInstructions: data.accessInstructions,
        contactPermission: true, // Default to true for now
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Save maintenance request to structured storage
      addMaintenanceRequest(maintenanceRequest)

      // Also save to legacy ticket system for backward compatibility
      const { ticketId, hashId } = generateTicketId(data.floor, data.unit)
      const legacyTicket = {
        ticketId,
        hashId,
        property: data.property,
        building: data.building || profile.building,
        floor: data.floor,
        unit: data.unit,
        requestType: data.requestType,
        category: data.category,
        title: data.title,
        description: data.description,
        preferredSchedule: data.preferredDate
          ? {
              date: data.preferredDate,
              timeRange: data.preferredTimeRange || "",
            }
          : undefined,
        accessInstructions: data.accessInstructions,
        contactPhone: data.contactPhone,
        photos: photos,
        priority: calculatedPriority,
        status: "Open" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      addTenantTicket(legacyTicket)

      // Clear draft
      setRequestDraft(null)

      toast({
        title: "Request Submitted!",
        description: `Your ${mappedRequestType} request #${requestId} has been submitted successfully.`,
      })

      // Redirect to requests page with new request highlighted
      router.push(`/tenant/requests?new=${requestId}`)
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableCategories = requestType ? categoryOptions[requestType] || [] : []

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Property Information
          </CardTitle>
          <CardDescription>Specify the location where maintenance is needed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="property">Property *</Label>
              <Select onValueChange={(value) => setValue("property", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Property 1">Property 1</SelectItem>
                  <SelectItem value="Property 2">Property 2</SelectItem>
                </SelectContent>
              </Select>
              {errors.property && <p className="text-sm text-red-600">{errors.property.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="building">Building / Tower</Label>
              <Input {...register("building")} placeholder="e.g., Main Tower, Building A" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floor">Floor Number *</Label>
              <Input type="number" min="1" {...register("floor", { valueAsNumber: true })} placeholder="e.g., 12" />
              {errors.floor && <p className="text-sm text-red-600">{errors.floor.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit / Room Number *</Label>
              <Input {...register("unit")} placeholder="e.g., 12A, 305, B-204" />
              {errors.unit && <p className="text-sm text-red-600">{errors.unit.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Details */}
      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>Describe the maintenance issue or service needed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Request Type *</Label>
            <RadioGroup
              onValueChange={(value) => {
                setValue("requestType", value as any)
                setValue("category", "") // Reset category when type changes
              }}
            >
              {Object.keys(categoryOptions).map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem value={type} id={type} />
                  <Label htmlFor={type} className="font-normal">
                    {type}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.requestType && <p className="text-sm text-red-600">{errors.requestType.message}</p>}
          </div>

          {requestType && (
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Short Title *</Label>
            <Input {...register("title")} placeholder="Brief description of the issue" maxLength={100} />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{errors.title?.message}</span>
              <span>{title?.length || 0}/100</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              {...register("description")}
              placeholder="Provide detailed information about the issue, including when it started, severity, and any relevant details..."
              rows={5}
              maxLength={1000}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{errors.description?.message}</span>
              <span>{description?.length || 0}/1000</span>
            </div>
          </div>

          {/* Priority Preview */}
          {requestType && title && description && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Calculated Priority:</span>
                <PriorityBadge priority={calculatedPriority} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule & Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule & Access
          </CardTitle>
          <CardDescription>Optional scheduling preferences and access instructions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred Date</Label>
              <Input type="date" {...register("preferredDate")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredTimeRange">Time Range</Label>
              <Select onValueChange={(value) => setValue("preferredTimeRange", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessInstructions">Access Instructions</Label>
            <Textarea
              {...register("accessInstructions")}
              placeholder="Special instructions for accessing the unit (e.g., key location, contact person, pet information)"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact & Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact & Documentation
          </CardTitle>
          <CardDescription>Contact information and optional photos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone *</Label>
            <Input
              {...register("contactPhone")}
              type="tel"
              placeholder="e.g., +1-555-0123, 09271857656, (555) 123-4567"
              className="max-w-md"
            />
            {errors.contactPhone && <p className="text-sm text-red-600">{errors.contactPhone.message}</p>}
            <p className="text-xs text-gray-500">
              Accepts various formats: international (+1-555-0123), local (09271857656), or formatted ((555) 123-4567)
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Photos (Optional)</Label>
              <p className="text-sm text-gray-600 mt-1">Upload up to 5 photos to help illustrate the issue</p>
            </div>

            <PhotoUploader
              photos={photos}
              onPhotosChange={(newPhotos) => {
                setPhotos(newPhotos)
                setValue("photos", newPhotos)
              }}
              maxPhotos={5}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button type="button" variant="outline" onClick={handleSaveDraft} className="sm:w-auto bg-transparent">
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>

        <Button type="submit" disabled={isSubmitting} className="sm:w-auto">
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  )
}
