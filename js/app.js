const apiKey = '9f176747b923620b00a8bc8aa89846d4'

const geocode = async city => {
  // Geocoding Endpoint
  let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)

  return await response.json()
}

const search = async city => {
  let cityDetails = await geocode(city)
  cityDetails = cityDetails[0]
  
  // Current Weather Endpoint
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityDetails.lat}&lon=${cityDetails.lon}&appid=${apiKey}`)
  const data = await response.json()

  // Save city details in 10 most-recent searches 
  addRecentSearch(data.name)
  console.log(data)
  return data
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

document.querySelector('.search').addEventListener('submit', async e => {
  e.preventDefault()
  const city = e.target.children[0].value.trim()
  if (!city) {
    // Do some error handling
    // Add message to page, turn input red
    return
  }
  const details = await search(city)  
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