export interface Guest {
  id?: number
  name: string
  duration: number
  payment: number
  roomsRequested: number
  roomType: string
  profitRatio?: number
}

export interface AlgorithmResult {
  acceptedGuests: Guest[]
  rejectedGuests: Guest[]
  totalRevenue: number
  usedRoomNights: number
  totalRoomNights: number
  occupancyRate: number
}

export interface SimulationResult {
  greedy: AlgorithmResult
  knapsack: AlgorithmResult
}
