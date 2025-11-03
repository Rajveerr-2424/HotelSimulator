"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Trash2 } from "lucide-react"

interface SidebarProps {
  onRunSimulation: (params: any) => void
  loading: boolean
}

export default function Sidebar({ onRunSimulation, loading }: SidebarProps) {
  const [hotelParams, setHotelParams] = useState({
    totalRooms: 50,
    simulationDays: 30,
    algorithm: "both",
  })

  const [guestForm, setGuestForm] = useState({
    name: "",
    duration: 3,
    payment: 300,
    roomsRequested: 1,
    roomType: "standard",
  })

  const [guests, setGuests] = useState<any[]>([])
  const [validationError, setValidationError] = useState<string | null>(null)

  const roomTypeMultipliers: Record<string, number> = {
    standard: 1,
    deluxe: 1.5,
    suite: 2.5,
  }

  const handleAddGuest = () => {
    setValidationError(null)

    if (!guestForm.name.trim()) {
      setValidationError("Guest name is required")
      return
    }

    if (guestForm.name.trim().length < 2) {
      setValidationError("Guest name must be at least 2 characters")
      return
    }

    setGuests([...guests, { ...guestForm, id: Date.now() }])
    setGuestForm({ name: "", duration: 3, payment: 300, roomsRequested: 1, roomType: "standard" })
  }

  const handleRemoveGuest = (id: number) => {
    setGuests(guests.filter((g) => g.id !== id))
  }

  const handleRunSimulation = () => {
    if (guests.length === 0) {
      setValidationError("Please add at least one guest")
      return
    }

    setValidationError(null)
    onRunSimulation({
      ...hotelParams,
      guests,
      roomTypeMultipliers,
    })
  }

  const calculatePayment = () => {
    const basePrice = 100
    const multiplier = roomTypeMultipliers[guestForm.roomType]
    return Math.round(basePrice * guestForm.duration * guestForm.roomsRequested * multiplier)
  }

  return (
    <div className="w-full md:w-80 bg-card border-r border-border overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Hotel Simulator</h1>
        <p className="text-xs md:text-sm text-muted-foreground">Compare Greedy vs Knapsack algorithms</p>
      </div>

      <Card className="p-4 space-y-4 bg-muted/50">
        <h2 className="font-semibold text-foreground text-sm">Hotel Configuration</h2>

        <div className="space-y-2">
          <Label className="text-xs font-medium">
            Total Rooms: <span className="font-bold text-primary">{hotelParams.totalRooms}</span>
          </Label>
          <Slider
            value={[hotelParams.totalRooms]}
            onValueChange={(val) => setHotelParams({ ...hotelParams, totalRooms: val[0] })}
            min={10}
            max={200}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">
            Simulation Days: <span className="font-bold text-primary">{hotelParams.simulationDays}</span>
          </Label>
          <Slider
            value={[hotelParams.simulationDays]}
            onValueChange={(val) => setHotelParams({ ...hotelParams, simulationDays: val[0] })}
            min={7}
            max={90}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Algorithm</Label>
          <Select
            value={hotelParams.algorithm}
            onValueChange={(val) => setHotelParams({ ...hotelParams, algorithm: val })}
          >
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="greedy">Greedy Only</SelectItem>
              <SelectItem value="knapsack">Knapsack Only</SelectItem>
              <SelectItem value="both">Both (Compare)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="p-4 space-y-4 bg-muted/50">
        <h2 className="font-semibold text-foreground text-sm">Add Guest Request</h2>

        {validationError && (
          <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
            {validationError}
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs font-medium">Guest Name</Label>
          <Input
            placeholder="e.g., John Doe"
            value={guestForm.name}
            onChange={(e) => {
              setGuestForm({ ...guestForm, name: e.target.value })
              setValidationError(null)
            }}
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">
            Stay Duration: <span className="font-bold text-primary">{guestForm.duration}d</span>
          </Label>
          <Slider
            value={[guestForm.duration]}
            onValueChange={(val) => setGuestForm({ ...guestForm, duration: val[0] })}
            min={1}
            max={30}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">
            Rooms Requested: <span className="font-bold text-primary">{guestForm.roomsRequested}</span>
          </Label>
          <Slider
            value={[guestForm.roomsRequested]}
            onValueChange={(val) => setGuestForm({ ...guestForm, roomsRequested: val[0] })}
            min={1}
            max={10}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Room Type</Label>
          <Select value={guestForm.roomType} onValueChange={(val) => setGuestForm({ ...guestForm, roomType: val })}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (1x)</SelectItem>
              <SelectItem value="deluxe">Deluxe (1.5x)</SelectItem>
              <SelectItem value="suite">Suite (2.5x)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-background p-3 rounded-md border border-border">
          <p className="text-xs text-muted-foreground mb-1">Calculated Payment:</p>
          <p className="text-xl font-bold text-primary">${calculatePayment()}</p>
        </div>

        <Button onClick={handleAddGuest} className="w-full bg-transparent" variant="outline">
          Add Guest
        </Button>
      </Card>

      <Card className="p-4 space-y-3 bg-muted/50">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-foreground text-sm">Guests ({guests.length})</h3>
          {guests.length > 0 && (
            <Button
              onClick={() => setGuests([])}
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Clear All
            </Button>
          )}
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {guests.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No guests added yet</p>
          ) : (
            guests.map((guest) => (
              <div
                key={guest.id}
                className="flex justify-between items-start bg-background p-2 rounded border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">{guest.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {guest.duration}d • {guest.roomsRequested}rm • ${guest.payment}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveGuest(guest.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                  aria-label={`Remove ${guest.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </Card>

      <Button
        onClick={handleRunSimulation}
        disabled={loading || guests.length === 0}
        className="w-full bg-primary text-primary-foreground font-semibold py-6"
        size="lg"
      >
        {loading ? "Running Simulation..." : "Run Simulation"}
      </Button>

      <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/30 rounded border border-border">
        <p className="font-semibold">Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Add 3-5 guests for best comparison</li>
          <li>Mix room types for variety</li>
          <li>Vary stay durations</li>
        </ul>
      </div>
    </div>
  )
}
