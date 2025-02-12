import axios from "axios";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// Function to get the date range from the current month to the last 12 months
const getDateRange = () => {
  const today = new Date();

  // Start date: First day of the current month, 12 months ago
  const startDate = new Date(today.getFullYear() - 1, today.getMonth(), 1);

  // End date: Last day of the previous month
  const endDate = new Date(today.getFullYear(), today.getMonth(), 0);

  return {
    from: startDate.toISOString(), // YYYY-MM-DD format
    to: endDate.toISOString(),
  };
};

export const fetchYearlyContributions = async (username) => {
  const { from, to } = getDateRange();

  const query = `
    query ($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      GITHUB_GRAPHQL_URL,
      {
        query,
        variables: { username, from, to },
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      },
    );

    // console.log("Response data:", response.data);

    if (response.data.errors) {
      console.error("GraphQL errors:", response.data.errors);
      throw new Error("Failed to fetch contributions data.");
    }

    const weeks =
      response.data.data.user.contributionsCollection.contributionCalendar
        .weeks;

    // Flatten weeks into an array of days
    const contributions = weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
      })),
    );

    // console.log(contributions);

    return contributions;
  } catch (error) {
    console.error(
      "Error fetching contributions:",
      error.response?.data || error.message,
    );
    throw new Error("Failed to fetch contributions data.");
  }
};

export default fetchYearlyContributions;
