interface GuestTableProps {
  guests: any[]
}

export default function GuestTable({ guests }: GuestTableProps) {
  if (guests.length === 0) {
    return <p className="text-sm text-muted-foreground">No guests</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-2 text-muted-foreground font-medium">Name</th>
            <th className="text-left py-2 px-2 text-muted-foreground font-medium">Days</th>
            <th className="text-left py-2 px-2 text-muted-foreground font-medium">Rooms</th>
            <th className="text-left py-2 px-2 text-muted-foreground font-medium">Payment</th>
            <th className="text-left py-2 px-2 text-muted-foreground font-medium">Ratio</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest, idx) => (
            <tr key={idx} className="border-b border-border hover:bg-muted/50">
              <td className="py-2 px-2 text-foreground">{guest.name}</td>
              <td className="py-2 px-2 text-foreground">{guest.duration}</td>
              <td className="py-2 px-2 text-foreground">{guest.roomsRequested}</td>
              <td className="py-2 px-2 text-foreground font-semibold">${guest.payment.toFixed(2)}</td>
              <td className="py-2 px-2 text-foreground">{guest.profitRatio.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
