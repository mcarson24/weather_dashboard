const apiKey = '9f176747b923620b00a8bc8aa89846d4'
let cityInfo = {}

// Elements
const main = document.querySelector('main')
const cityName = document.querySelector('#city-name')
const currentWeather = document.querySelector('#current-weather')

const geocode = async city => {
  // Geocoding Endpoint
  let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)

  return await response.json()
}

const search = async city => {
  // TODO: Handle cases where no city is returned from the api call.
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

const addCityToRecentSearch = () => {
  const city = cityInfo.name
  const recents = JSON.parse(localStorage.getItem('recentSearches')) || []
  // If the city is already in the most recents searches, move it to the first item in the array 
  if (recents.includes(city)) recents.splice(recents.indexOf(city), 1)
  recents.unshift(city)
  // Limit the array to the ten most recent searches
  recents.splice(10)
  localStorage.setItem('recentSearches', JSON.stringify(recents))
  updateRecentSearches()
}

const updateRecentSearches = () => {
  const searches = JSON.parse(localStorage.getItem('recentSearches'))
  const recentSearches = document.querySelector('#recent-searches')
  recentSearches.innerHTML = ''
  searches.forEach(search => {
    const li = document.createElement('li')
    li.textContent = search
    recentSearches.append(li)
  })
}


const updatePage = () => {
  cityName.textContent = cityInfo.name
  main.classList.add('searched')
  main.classList.remove('no-search')
  currentWeather.children[0].children[0].children[0].setAttribute('src', `http://openweathermap.org/img/wn/${cityInfo.current.weather[0].icon}@4x.png`);
  currentWeather.children[0].children[0].children[1].children[0].children[0].children[0].children[0].textContent = cityInfo.current.temp
  currentWeather.children[0].children[0].children[1].children[0].children[1].children[0].children[0].textContent = cityInfo.current.feels_like
  currentWeather.children[0].children[0].children[1].children[1].children[0].children[0].children[0].textContent = cityInfo.current.humidity
  currentWeather.children[0].children[0].children[1].children[1].children[1].children[0].children[0].textContent = cityInfo.current.wind_speed
  const uv_index = parseFloat(cityInfo.current.uvi)
  console.log(uv_index)
  let uv_class = 'extreme'
  if (uv_index <= 10) uv_class = 'very-high'
  if (uv_index <= 7) uv_class = 'high'
  if (uv_index <= 5) uv_class = 'moderate'
  if (uv_index <= 2) uv_class = 'low'
  console.log(uv_class)
  currentWeather.children[0].children[0].children[1].children[2].children[0].children[0].textContent = cityInfo.current.uvi
  currentWeather.children[0].children[0].children[1].children[2].children[0].children[0].classList = `uv ${uv_class} text-3xl font-bold`
  
}

document.querySelector('.search').addEventListener('submit', async e => {
  e.preventDefault()
  const city = e.target.children[0].value.trim()
  if (!city) {
    // TODO: Do some error handling
    // TODO: Add message to page, turn input red
    return
  }
  await search(city)
  updatePage()
  document.querySelector('#city').value = ''
})

document.addEventListener('DOMContentLoaded', () => {
  updateRecentSearches()
})