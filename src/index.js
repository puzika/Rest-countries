'use strict';

import './styles/main.scss';

const body = document.body;
const header = document.querySelector('.header');
const countriesContainer = document.querySelector('.countries');
const filter = document.querySelector('.search__filter');
const dropDownIcon = document.querySelector('.drop-down-icon');
const regions = document.querySelector('.search__regions');
const darkMode = document.querySelector('.dark-mode');
const darkModeIcon = document.querySelector('.dark-mode__icon');
const search = document.querySelector('.search__field');
const searchIcon = document.querySelector('.search__icon');
const details = document.querySelector('.details');
const detailFlag = document.querySelector('.details__flag');
const detailName = document.querySelector('.details__name');
const detailNativeName = document.querySelector('.details__native-name');
const detailPopulation = document.querySelector('.details__population');
const detailRegion = document.querySelector('.details__region');
const detailSubreg = document.querySelector('.details__subreg');
const detailCapital = document.querySelector('.details__capital');
const detailDomain = document.querySelector('.details__domain');
const detailCurrency = document.querySelector('.details__currency');
const detailLanguage = document.querySelector('.details__language');
const buttonReturn = document.querySelector('.btn--return');

const initialCountries = ['usa', 'canada', 'australia', 'russia', 'uzbekistan', 'germany', 'china', 'japan', 'saudi', 'denmark', 'ireland'];

const countriesData = new Map();

let mode = 'l';

function renderCountry(data) {
   const markup = `
      <div data-name="${data.name.official}" class="country ${mode === 'd' ? 'country--dark' : ''}">
         <img src="${data.flags.png}" alt="" class="country__flag">
         
         <article class="country__info">
            <h2 class="country__name">${data.name.official}</h2>

            <p class="country__data">Population:<span class="population">${data.population}</span></p>
            <p class="country__data">Region:<span class="region">${data.region}</span></p>
            <p class="country__data">Capital:<span class="capital">${data.capital}</span></p>
         </article>
      </div>
   `;

   countriesContainer.insertAdjacentHTML('afterbegin', markup);
}

function timer(seconds) {
   return new Promise(function (_, reject) {
      setTimeout(() => {
         reject(new Error('Request took too long'));
      }, seconds * 1000);
   });
}

async function getCountryData(country) {
   try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);

      if (!response.ok) throw new Error(`No such country found: ${country}`);

      const [data] = await response.json();

      countriesData.set(data.name.official, data);

      renderCountry(data);
   } catch (error) {
      throw error;
   }
}

async function getCountry(country) {
   try {
      const result = await Promise.race(
         [
            getCountryData(country),
            timer(5),
         ]
      );
   } catch (error) {
      console.log(error);
   }
}


async function getRegion(region) {
   try {
      const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);

      const data = await response.json();

      data.forEach(country => {
         countriesData.set(country.name.official, country);
         renderCountry(country);
      });
   } catch (error) {
      console.error(error);
   }
}

function showDetails(data) {
   details.classList.add('details--show');

   let nativeName;
   let currency;
   let language;

   for (const prop in data.name.nativeName) nativeName = data.name.nativeName[prop];
   for (const prop in data.currencies) currency = data.currencies[prop];
   for (const prop in data.languages) language = data.languages[prop];

   detailFlag.src = data.flags.png;
   detailName.textContent = data.name.official;
   detailNativeName.textContent = nativeName.official;
   detailPopulation.textContent = data.population;
   detailRegion.textContent = data.region;
   detailSubreg.textContent = data.subregion;
   detailCapital.textContent = data.capital;
   detailDomain.textContent = data.tld[0];
   detailCurrency.textContent = currency.name;
   detailLanguage.textContent = language;
}

function hideDetails() {
   details.classList.remove('details--show');
}

initialCountries.forEach(country => getCountry(country));

filter.addEventListener('click', function (e) {
   dropDownIcon.classList.toggle('flipped');
   regions.classList.toggle('hidden');
});

document.addEventListener('click', function (e) {
   const target = e.target;

   if (target.closest('.search__filter')) return;

   dropDownIcon.classList.remove('flipped');
   regions.classList.add('hidden');
});

search.addEventListener('keyup', function (e) {
   if (e.key === "Enter") {
      e.preventDefault();

      countriesContainer.textContent = '';

      const countryName = this.value.trim();

      this.value = '';

      this.blur();

      countriesData.clear();

      getCountry(countryName);
   }
});

regions.addEventListener('click', function (e) {
   const target = e.target;

   const placeholder = filter.querySelector('p');

   placeholder.textContent = target.textContent;

   countriesContainer.textContent = '';

   countriesData.clear();

   (async function () {
      try {
         await Promise.race(
            [
               getRegion(target.textContent),
               timer(15)
            ]
         )
      } catch (error) {
         console.log(error);
      }
   })();
});

countriesContainer.addEventListener('click', function (e) {
   const target = e.target.closest('.country');

   if (!target) return;

   const name = target.dataset.name;

   const data = countriesData.get(name);

   showDetails(data);
});

buttonReturn.addEventListener('click', function () {
   hideDetails();
})

darkMode.addEventListener('click', function (e) {
   const target = e.target.closest('.dark-mode');
   const countries = document.querySelectorAll('.country');
   const buttons = document.querySelectorAll('.btn');

   if (mode === 'd') mode = 'l';
   else mode = 'd';

   body.classList.toggle('dark');
   header.classList.toggle('header--dark');
   darkModeIcon.classList.toggle('dark-mode__icon--dark');
   search.classList.toggle('search__field--dark');
   searchIcon.classList.toggle('search__icon--dark');
   regions.classList.toggle('search__regions--dark');
   filter.classList.toggle('search__filter--dark');
   dropDownIcon.classList.toggle('drop-down-icon--dark');
   details.classList.toggle('details--dark');

   countries.forEach(country => country.classList.toggle('country--dark'));
   buttons.forEach(button => button.classList.toggle('btn--dark'));
});