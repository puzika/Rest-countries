'use strict';

import './styles/main.scss';

const countriesContainer = document.querySelector('.countries');
const filter = document.querySelector('.search__filter');
const dropDownIcon = document.querySelector('.drop-down-icon');
const regions = document.querySelector('.search__regions');
const darkMode = document.querySelector('.dark-mode');
const search = document.querySelector('.search__field');

const initialCountries = ['usa', 'canada', 'australia', 'russia', 'uzbekistan', 'germany', 'china', 'japan', 'saudi', 'denmark', 'ireland'];

let mode = 'l';

function renderCountry(data) {
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

      data.forEach(country => renderCountry(country));
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
});

search.addEventListener('keyup', function (e) {
   if (e.key === "Enter") {
      e.preventDefault();

      countriesContainer.textContent = '';

      console.log(getCountry(this.value.trim()));
   }
});

regions.addEventListener('click', function (e) {
   const target = e.target;

   const placeholder = filter.querySelector('p');

   placeholder.textContent = target.textContent;

   countriesContainer.textContent = '';

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