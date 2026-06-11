import React from 'react';

export default function RideHistoryWidget({ stats, history }) {
  return (
    <div className="bg-white border-[1.5px] border-line-soft rounded-[20px] p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display font-bold text-lg text-ink">My rides this month</h3>
        <span className="font-mono text-[10px] tracking-[0.1em] uppercase bg-[#e6f0e9] text-[#1f4d3e] px-3 py-1.5 rounded-full font-bold">
          Active
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border-[1.5px] border-line-soft rounded-[14px] p-5 relative overflow-hidden">
          <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-amber rounded-r-full"></div>
          <div className="font-display font-bold text-3xl text-ink mb-1">{stats.totalRides}</div>
          <div className="text-sm text-grey">Rides taken</div>
        </div>
        <div className="border-[1.5px] border-line-soft rounded-[14px] p-5 relative overflow-hidden">
          <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-line rounded-r-full"></div>
          <div className="font-display font-bold text-3xl text-ink mb-1">₹{stats.totalSpent}</div>
          <div className="text-sm text-grey">Spent</div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-0">
        {history.map((ride, index) => (
          <div key={ride.id} className={`flex justify-between items-center py-5 ${index !== history.length - 1 ? 'border-b border-line-soft' : ''}`}>
            
            <div className="flex gap-4">
              {/* Mini Timeline */}
              <div className="relative flex flex-col items-center mt-1.5">
                <div className="w-2 h-2 rounded-full bg-amber"></div>
                <div className="w-[1.5px] h-6 bg-line-soft my-1"></div>
                <div className="w-2 h-2 rounded-sm bg-line"></div>
              </div>
              
              <div>
                <h4 className="font-display font-bold text-ink text-[1.05rem] mb-0.5">
                  {ride.pickup} → {ride.destination}
                </h4>
                <div className="text-sm text-grey">
                  {ride.driverName} · {ride.date}
                </div>
              </div>
            </div>

            <div>
              {ride.status === 'In Progress' ? (
                <span className="font-mono text-[10px] tracking-[0.1em] uppercase bg-[#e3eef0] text-[#1f5d6e] px-3 py-1.5 rounded-full font-bold">
                  In Progress
                </span>
              ) : (
                <span className="font-mono text-[10px] tracking-[0.1em] uppercase bg-[#e6f0e9] text-[#1f4d3e] px-3 py-1.5 rounded-full font-bold">
                  Completed
                </span>
              )}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}