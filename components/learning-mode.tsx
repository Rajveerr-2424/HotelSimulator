import { Card } from "@/components/ui/card"
import type { SimulationResult } from "@/types"

interface LearningModeProps {
  results: SimulationResult
}

export default function LearningMode({ results }: LearningModeProps) {
  return (
    <Card className="p-6 bg-muted/50 border-primary/20">
      <h2 className="text-lg font-bold text-foreground mb-4">Learning Mode: Algorithm Explanation</h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Greedy Algorithm</h3>
          <p className="text-sm text-muted-foreground">
            The Greedy algorithm sorts guests by their profit-to-room-night ratio (payment ÷ room-nights) in descending
            order. It then accepts guests sequentially until the hotel runs out of available room-nights. This approach
            maximizes revenue per room-night but may miss better combinations.
          </p>
          <div className="bg-background p-3 rounded text-xs font-mono text-foreground">
            <p>Sort by: Payment / (Rooms × Days)</p>
            <p>Accept guests until capacity full</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Knapsack Algorithm (0/1)</h3>
          <p className="text-sm text-muted-foreground">
            The Knapsack algorithm uses dynamic programming to find the optimal combination of guests that maximizes
            total revenue without exceeding the hotel's room-night capacity. Each guest is either fully accepted or
            rejected (0/1 constraint).
          </p>
          <div className="bg-background p-3 rounded text-xs font-mono text-foreground">
            <p>Capacity: Total Room-Nights</p>
            <p>Value: Guest Payment</p>
            <p>Weight: Rooms × Days</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-background rounded border border-border">
        <p className="text-xs text-muted-foreground mb-2">Performance Metrics:</p>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Greedy Revenue</p>
            <p className="font-bold text-foreground">${results.greedy.totalRevenue.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Knapsack Revenue</p>
            <p className="font-bold text-foreground">${results.knapsack.totalRevenue.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Difference</p>
            <p
              className={`font-bold ${results.knapsack.totalRevenue > results.greedy.totalRevenue ? "text-green-600" : "text-red-600"}`}
            >
              ${Math.abs(results.knapsack.totalRevenue - results.greedy.totalRevenue).toFixed(0)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Better Algorithm</p>
            <p className="font-bold text-foreground">
              {results.knapsack.totalRevenue > results.greedy.totalRevenue ? "Knapsack" : "Greedy"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
