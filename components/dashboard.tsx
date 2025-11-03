"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { SimulationResult } from "@/types"
import GuestTable from "./guest-table"
import LearningMode from "./learning-mode"

interface DashboardProps {
  results: SimulationResult | null
  loading: boolean
  learningMode: boolean
  setLearningMode: (val: boolean) => void
}

export default function Dashboard({ results, loading, learningMode, setLearningMode }: DashboardProps) {
  const [showCharts, setShowCharts] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Running Simulation...</h2>
          <p className="text-muted-foreground">Comparing algorithms and optimizing revenue</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-3xl font-bold text-foreground">Welcome to Hotel Simulator</h2>
          <p className="text-muted-foreground text-lg">
            Configure your hotel and guests in the sidebar, then run a simulation to compare algorithms
          </p>
          <div className="pt-4 text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
            <p>
              Tip: Add multiple guests with different durations and room types to see how each algorithm optimizes
              revenue
            </p>
          </div>
        </div>
      </div>
    )
  }

  const chartData = [
    { name: "Greedy", revenue: results.greedy.totalRevenue, occupancy: results.greedy.occupancyRate },
    { name: "Knapsack", revenue: results.knapsack.totalRevenue, occupancy: results.knapsack.occupancyRate },
  ]

  const occupancyData = [
    { name: "Occupied", value: results.greedy.usedRoomNights },
    { name: "Available", value: results.greedy.totalRoomNights - results.greedy.usedRoomNights },
  ]

  const COLORS = ["#3b82f6", "#fbbf24"]

  const handleExportPDF = async () => {
    setExportLoading(true)
    setExportError(null)
    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(results),
      })

      if (!response.ok) {
        throw new Error("Failed to export report")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "hotel-simulation-report.html"
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export error:", error)
      setExportError("Failed to export report. Please try again.")
    } finally {
      setExportLoading(false)
    }
  }

  const revenueDifference = results.knapsack.totalRevenue - results.greedy.totalRevenue
  const isBetter = revenueDifference > 0

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Simulation Results</h1>
            <p className="text-muted-foreground mt-1">Algorithm Performance Comparison</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCharts(!showCharts)}
              size="sm"
              className="text-xs md:text-sm"
            >
              {showCharts ? "Hide" : "Show"} Charts
            </Button>
            <Button
              variant="outline"
              onClick={() => setLearningMode(!learningMode)}
              size="sm"
              className="text-xs md:text-sm"
            >
              {learningMode ? "Hide" : "Show"} Learning
            </Button>
            <Button
              onClick={handleExportPDF}
              disabled={exportLoading}
              className="bg-primary text-primary-foreground text-xs md:text-sm"
              size="sm"
            >
              {exportLoading ? "Exporting..." : "Export Report"}
            </Button>
          </div>
        </div>

        {exportError && (
          <Card className="p-4 bg-destructive/10 border-destructive/20">
            <p className="text-sm text-destructive">{exportError}</p>
          </Card>
        )}

        {learningMode && <LearningMode results={results} />}

        <Card className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Performance Winner</h3>
              <p className="text-sm text-muted-foreground">
                {isBetter ? "Knapsack" : "Greedy"} algorithm generated ${Math.abs(revenueDifference).toFixed(2)} more
                revenue
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl md:text-3xl font-bold text-primary">
                {(
                  (Math.abs(revenueDifference) / Math.max(results.greedy.totalRevenue, results.knapsack.totalRevenue)) *
                  100
                ).toFixed(1)}
                %
              </p>
              <p className="text-xs text-muted-foreground">improvement</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 md:p-6">
            <h3 className="font-semibold text-foreground mb-4">Greedy Algorithm</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Total Revenue:</span>
                <span className="font-bold text-lg text-foreground">${results.greedy.totalRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Occupancy Rate:</span>
                <span className="font-bold text-lg text-foreground">{results.greedy.occupancyRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Accepted Guests:</span>
                <span className="font-bold text-lg text-foreground">{results.greedy.acceptedGuests.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Rejected Guests:</span>
                <span className="font-bold text-lg text-foreground">{results.greedy.rejectedGuests.length}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h3 className="font-semibold text-foreground mb-4">Knapsack Algorithm</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Total Revenue:</span>
                <span className="font-bold text-lg text-foreground">${results.knapsack.totalRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Occupancy Rate:</span>
                <span className="font-bold text-lg text-foreground">{results.knapsack.occupancyRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Accepted Guests:</span>
                <span className="font-bold text-lg text-foreground">{results.knapsack.acceptedGuests.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Rejected Guests:</span>
                <span className="font-bold text-lg text-foreground">{results.knapsack.rejectedGuests.length}</span>
              </div>
            </div>
          </Card>
        </div>

        {showCharts && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="p-4 md:p-6">
              <h3 className="font-semibold text-foreground mb-4">Revenue Comparison</h3>
              <div className="w-full h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4 md:p-6">
              <h3 className="font-semibold text-foreground mb-4">Room Occupancy</h3>
              <div className="w-full h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Card className="p-4 md:p-6">
            <h3 className="font-semibold text-foreground mb-4">Greedy - Accepted Guests</h3>
            <GuestTable guests={results.greedy.acceptedGuests} />
          </Card>

          <Card className="p-4 md:p-6">
            <h3 className="font-semibold text-foreground mb-4">Greedy - Rejected Guests</h3>
            <GuestTable guests={results.greedy.rejectedGuests} />
          </Card>

          <Card className="p-4 md:p-6">
            <h3 className="font-semibold text-foreground mb-4">Knapsack - Accepted Guests</h3>
            <GuestTable guests={results.knapsack.acceptedGuests} />
          </Card>

          <Card className="p-4 md:p-6">
            <h3 className="font-semibold text-foreground mb-4">Knapsack - Rejected Guests</h3>
            <GuestTable guests={results.knapsack.rejectedGuests} />
          </Card>
        </div>
      </div>
    </div>
  )
}
