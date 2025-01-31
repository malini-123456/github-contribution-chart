import React from "react";
import {
  format,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  getDay,
  getMonth,
} from "date-fns";
import classNames from "classnames";

const HeatmapCalendar = ({ data }) => {
  // debugger;
  // if (!data || data.length === 0) return null;
  // console.log(data);

  const startDate = startOfYear(new Date());
  const endDate = endOfYear(new Date());

  // Generate all days between startDate & endDate
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Group days by week
  const weeks = [];
  let week = new Array(getDay(startDate)).fill(null); // Add empty slots for offset
  days.forEach((day, index) => {
    if (getDay(day) === 0 && week.length > 0) {
      weeks.push(week);
      week = [];
    }
    week.push(day);
    if (index === days.length - 1) weeks.push(week);
  });

  // Get unique months for the header
  const months = [];
  days.forEach((day) => {
    if (day.getDate() === 1) {
      months.push({ name: format(day, "MMM"), index: days.indexOf(day) });
    }
  });

  // Weekday labels
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Convert array of objects to a map for quick lookups
  const dataMap = data.reduce((acc, item) => {
    acc[item.date] = item.count;
    return acc;
  }, {});

  // Define a function to get intensity based on contribution value
  const getIntensity = (date) => {
    const value = dataMap[format(date, "yyyy-MM-dd")] || 0;

    if (value === 0) return "bg-gray-200"; // No contributions
    if (value <= 3) return "bg-green-300"; // Low contributions
    if (value <= 7) return "bg-green-500"; // Moderate contributions
    if (value <= 11) return "bg-green-700"; // High contributions
    return "bg-green-900"; // Very high contributions
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-10 text-xl font-semibold">GitHub-like Heatmap</h2>
      {/* Heatmap */}
      <div className="relative">
        {/* Month Names */}
        <div className="absolute -top-5 left-12 flex w-full justify-between">
          {months.map((month, index) => (
            <div
              key={index}
              className="text-center text-xs font-medium"
              style={{
                position: "absolute",
                left: `${(month.index * 97) / days.length}%`, // Dynamically align month names
              }}
            >
              {month.name}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Weekday Names  */}
          {/* only display monday wednesday and friday */}
          <div className="mr-3 flex flex-col gap-1">
            {weekDays.map((day, index) => (
              <div
                key={index}
                className="flex h-4 w-4 items-center justify-center text-xs font-medium"
              >
                {index % 2 === 0 ? "" : day}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) =>
                  day ? (
                    <div
                      key={dayIndex}
                      className={classNames(
                        "h-4 w-4 rounded",
                        getIntensity(day),
                      )}
                      title={`${format(day, "yyyy-MM-dd")}: ${
                        dataMap[format(day, "yyyy-MM-dd")] || 0
                      } contributions`} // Native tooltip
                    ></div>
                  ) : (
                    // Empty slots for offset days
                    <div key={dayIndex} className="h-4 w-4"></div>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center">
        <span className="mr-2 text-sm font-medium">Less</span>
        <div className="mx-1 h-4 w-4 rounded bg-gray-200"></div>
        <div className="mx-1 h-4 w-4 rounded bg-green-300"></div>
        <div className="mx-1 h-4 w-4 rounded bg-green-500"></div>
        <div className="mx-1 h-4 w-4 rounded bg-green-700"></div>
        <div className="mx-1 h-4 w-4 rounded bg-green-900"></div>
        <span className="ml-2 text-sm font-medium">More</span>
      </div>
    </div>
  );
};

export default HeatmapCalendar;
