import axios from "axios";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN; // Replace with your token

const fetchYearlyContributions = async (username) => {
  const query = `
    query ($username: String!) {
      user(login: $username) {
        contributionsCollection {
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
        variables: { username },
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      },
    );

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
