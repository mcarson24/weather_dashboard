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
  return await response.json()
}

(async () => {
  const data = await search('Cologne')
})()


document.querySelector('.search').addEventListener('submit', async e => {
  e.preventDefault()
  const city = e.target.children[0].value.trim()
  if (!city) {
    // Do some error handling
    // Add message to page, turn input red
    return
  }
  const details = await search(city)
  console.log(details)
})