let button = document.getElementById("fetchBtn");
let resultDiv = document.getElementById("result");
let citySelect = document.getElementById("citySelect");
let selectedCity = null;
let fetchCities = async (city) => {
    try {
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
        );
        let geoData = await geoRes.json();
        if (!geoData.results) {
            resultDiv.innerText = "City not fond";
            citySelect.innerHTML = "";
            return;
        }
        citySelect.innerHTML = "";
        geoData.results.forEach((cityObj, index) => {
            let option = document.createElement("option");
            option.value = index;
            option.textContent = `${cityObj.name}, ${cityObj.country}`;
            citySelect.appendChild(option);
        });
        selectedCity = geoData.results[0];
        citySelect.addEventListener("change", () => {
            selectedCity = geoData.results[citySelect.value];
        });
        resultDiv.innerText = "Choose your kitty";
    } catch (error) {
        resultDiv.innerText = "Error fetching city";
        console.error(error);
    }
};
button.addEventListener("click", async () => {
    try {
        if (!selectedCity) {
            resultDiv.innerText = "search and select a city";
            return;
        }
        let { latitude, longitude, name } = selectedCity;
        let weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
        );
        let weatherData = await weatherRes.json();
        let temperature = weatherData.current.temperature_2m;
        resultDiv.innerHTML = `temperatue ${name}: ${temperature}°C`;
    } catch (error) {
        resultDiv.innerText = "Error fetching weather.";
        console.error(error);
    }
});