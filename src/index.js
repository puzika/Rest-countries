'use strict';

import './styles/main.scss';

const countriesContainer = document.querySelector('.countries');
const filter = document.querySelector('.search__filter');
const dropDownIcon = document.querySelector('.drop-down-icon');
const regions = document.querySelector('.search__regions');

const initialCountries = ['usa', 'canada', 'australia', 'russia', 'uzbekistan', 'germany', 'china', 'japan', 'saudi', 'denmark', 'ireland'];

function renderCountry(data) {
   console.log(data);

   const markup = `
      <div class="country">
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

async function getCountry(country) {
   try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);

      const [data] = await response.json();

      renderCountry(data);
   } catch (error) {
      console.error(error);
   }
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
})