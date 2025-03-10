import React from "react";
import { format, eachDayOfInterval, getDay } from "date-fns";

const HeatmapCalendar = ({ data, selectedTheme }) => {
  if (!data || data.length === 0) return;

  // Use the actual data range
  const startDate = new Date(data[0].date);
  const endDate = new Date(data[data.length - 1].date);

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

  // console.log("Mapped Contributions Data:", dataMap);

  // Define a function to get intensity based on contribution value
  const getIntensity = (date) => {
    const dateString = format(date, "yyyy-MM-dd");
    const value = dataMap[dateString] || 0;

    // console.log(`Checking Date: ${dateString}, Contributions: ${value}`);

    if (value === 0) return selectedTheme.grade0; // No contributions
    if (value <= 3) return selectedTheme.grade1; // Low contributions
    if (value <= 7) return selectedTheme.grade2; // Moderate contributions
    if (value <= 10) return selectedTheme.grade3; // High contributions
    return selectedTheme.grade4; // Very high contributions
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="pl-2">
        <div className="relative">
          {/* Month Names */}
          <div
            className="absolute -top-6 left-12 flex w-full justify-between"
            style={{ color: selectedTheme.text }}
          >
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
            <div
              className="mr-3 flex flex-col gap-1"
              style={{ color: selectedTheme.text }}
            >
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
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: getIntensity(day) }}
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
      </div>
      {/* Legend */}
      <div
        className="ml-auto flex items-center"
        style={{ color: selectedTheme.text }}
      >
        <span className="mr-1 text-xs font-medium">Less</span>
        <div
          className="mx-1 h-3 w-3 rounded"
          style={{ backgroundColor: selectedTheme.grade0 }}
        ></div>
        <div
          className="mx-1 h-3 w-3 rounded"
          style={{ backgroundColor: selectedTheme.grade1 }}
        ></div>
        <div
          className="mx-1 h-3 w-3 rounded"
          style={{ backgroundColor: selectedTheme.grade2 }}
        ></div>
        <div
          className="mx-1 h-3 w-3 rounded"
          style={{ backgroundColor: selectedTheme.grade3 }}
        ></div>
        <div
          className="mx-1 h-3 w-3 rounded"
          style={{ backgroundColor: selectedTheme.grade4 }}
        ></div>
        <span className="ml-1 text-xs font-medium">More</span>
      </div>
    </div>
  );
};

export default HeatmapCalendar;
