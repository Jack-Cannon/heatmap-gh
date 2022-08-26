import './App.css';
import { useQuery, gql } from '@apollo/client';
import CalendarHeatmap from 'react-calendar-heatmap';


const GET_GRAPH = gql`
query($userName:String!) { 
  user(login: $userName){
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
`;


function UserContributionGraph({userName}) {

  const { loading, error, data } = useQuery(GET_GRAPH, {
    variables: {userName: userName}
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  var processedData = []

  var semiFlat = data.user.contributionsCollection.contributionCalendar.weeks
  semiFlat.forEach(x => {
    processedData = [...processedData, x.contributionDays]
  })

  var contributions = processedData.flat()

  var contributionValues = contributions.map(x => 
    x = {'date': x.date, 'count': x.contributionCount}
  ).filter(x => x.count !== 0)

  return (
    <div>
      <CalendarHeatmap
        startDate={new Date(contributions[0].date)}
        endDate={new Date(contributions[contributions.length -1].date)}
        values={
          contributionValues
        }
      />
    </div>
  ) 
}

function App() {
  return (
    <div className="App">
      <UserContributionGraph userName='Jack-Cannon'/>
    </div>
  );
}

export default App;
