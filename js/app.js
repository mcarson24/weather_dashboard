const apiKey = '9f176747b923620b00a8bc8aa89846d4'
let cityInfo = {}

const geocode = async city => {
  // Geocoding Endpoint
  let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)

  return await response.json()
}

const search = async city => {
  const cityDetails = await geocode(city)

  // Use one-call endpoing to get current and forecastes weather data
  await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityDetails[0].lat}&lon=${cityDetails[0].lon}&appid=${apiKey}&units=imperial`)
    .then(response => response.json())
    .then(({ current, daily }) => {
      cityInfo = {
        name: cityDetails[0].name,
        current,
        daily: daily.splice(1, 5)
      }
      // Save city details to 10 most-recent searches in local storage
      addCityToRecentSearch()
    })
}

addCityToRecentSearch = () => {
  const city = cityInfo.name
  const recents = JSON.parse(localStorage.getItem('recentSearches')) || []
  // If the city is already in the most recents searches, move it to the first item in the array 
  if (recents.includes(city)) recents.splice(recents.indexOf(city), 1)
  recents.unshift(city)
  // Limit the array to the ten most recent searches
  recents.splice(10)
  localStorage.setItem('recentSearches', JSON.stringify(recents))
}

document.querySelector('.search').addEventListener('submit', async e => {
  e.preventDefault()
  const city = e.target.children[0].value.trim()
  if (!city) {
    // Do some error handling
    // Add message to page, turn input red
    return
  }
  await search(city)
})

document.addEventListener('DOMContentLoaded', (e) => {
  const searches = JSON.parse(localStorage.getItem('recentSearches'))

  searches.forEach(search => {
    const li = document.createElement('li')
    li.textContent = search
    document.querySelector('#recent-searches').append(li)
  })

  document.querySelector('#recent-searches').addEventListener('click', e => {
    if (!e.target.matches('li')) return
    search(e.target.textContent)
  })
});
