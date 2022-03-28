const apiKey = '9f176747b923620b00a8bc8aa89846d4'

const geocode = async city => {
  // Geocoding Endpoint
  let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)

  return await response.json()
}

(async () => {
  const data = await geocode('Nuremberg')
  document.querySelector('#city-name').textContent = data[0].name
  document.querySelector('#lat').textContent = data[0].lat
  document.querySelector('#long').textContent = data[0].lon
})()