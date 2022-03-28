const apiKey = '9f176747b923620b00a8bc8aa89846d4'
let cityInformation

const geocode = async city => {
  // Geocoding Endpoint
  let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)

  return await response.json()
}

const search = async city => {
  let cityDetails = await geocode(city)
  cityInformation = cityDetails[0]

  // Current Weather Endpoint
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityInformation.lat}&lon=${cityInformation.lon}&appid=${apiKey}`)
  return await response.json()
}

const forecast = async city => {
  // 5-day forecast Endpoint
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${cityInformation.lat}&lon=${cityInformation.lon}&appid=${apiKey}`)

  const forecast = await response.json()
  let fiveDay = {}
  forecast.list.forEach(weatherInfo => {
    if (!fiveDay[weatherInfo.dt_txt.slice(0, "2022-03-29 00:00:00".indexOf('00:00') - 1)]) {
      fiveDay[weatherInfo.dt_txt.slice(0, "2022-03-29 00:00:00".indexOf('00:00') - 1)] = weatherInfo
    }
  })
  return fiveDay
}

addRecentSearch = city => {
  const recents = JSON.parse(localStorage.getItem('recentSearches')) || []
  // If the city is already in the most recents searches, make it the first item in the array 
  if (recents.includes(city)) recents.splice(recents.indexOf(city), 1)
  recents.unshift(city)
  // Limit recent searches to the ten most recent
  recents.splice(10)
  localStorage.setItem('recentSearches', JSON.stringify(recents))
}

(async () => {
})()


document.querySelector('.search').addEventListener('submit', async e => {
  e.preventDefault()
  const city = e.target.children[0].value.trim()
  if (!city) {
    // Do some error handling
    // Add message to page, turn input red
    return
  }
  const currentWeather = await search(city)
  const fiveDayForecast = await forecast(city)
  // Save city details in 10 most-recent searches 
  addRecentSearch(currentWeather.name)
})