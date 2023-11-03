import React, { useState, useEffect } from "react";
import Papa from "papaparse"; // Библиотека для парсинга CSV
import currentCSV from './dumps/ceac_03_25.csv'
import prevCSV from './dumps/ceac_03_23.csv'

const regionValues = ["AF", "AS", "EU", "NA", "OC", "SA"]; // Возможные значения поля region
const statusValues = ["Issued", "AP", "Refused", "Refused221g", "Ready", "InTransit"]; // Возможные значения поля status
const statusForConsulate = ["Issued", "AP", "Refused", "Refused221g", "Ready"]; // Возможные значения поля status
const consulates = {
  "ABD": "Abu Dhabi, United Arab Emirates",
  "ABJ": "Abidjan, Cote d'Ivoire",
  "ACC": "Accra, Ghana",
  "ACK": "Auckland, New Zealand",
  "ADD": "Addis Ababa, Ethiopia",
  "AKD": "Ashgabat, Turkmenistan",
  "ALG": "Algiers, Algeria ",
  "AMM": "Amman, Jordan",
  "AMS": "Amsterdam, Netherlands",
  "ANK": "Ankara, Turkey",
  "ANT": "Antananarivo, Madagascar",
  "ASM": "Asmara, Eritrea",
  "ASN": "Asuncion, Paraguay",
  "ATA": "Almaty, Kazakhstan",
  "ATH": "Athens, Greece",
  "BCH": "Bucharest, Romania",
  "BDP": "Budapest, Hungary",
  "BEN": "Bern, Switzerland",
  "BGH": "Baghdad, Iraq",
  "BGI": "Bangui, Central African Republic",
  "BGN": "Bridgetown, Barbados ",
  "BGT": "Bogota, Colombia",
  "BKK": "Bishkek, Kyrgyzstan",
  "BLG": "Belgrade, Serbia",
  "BLZ": "Belmopan, Belize",
  "BMB": "Mumbai, India",
  "BNK": "Bangkok, Thailand",
  "BNS": "Buenos Aires, Argentina",
  "BRS": "Brussels, Belgium",
  "BRT": "Beirut, Lebanon",
  "BRZ": "Brazzaville, Republic of the Congo",
  "BTS": "Bratislava, Slovakia",
  "BUJ": "Bujumbura, Burundi",
  "CDJ": "Ciudad Juarez, Mexico",
  "CHS": "Chisinau, Moldova",
  "CLM": "Colombo, Sri Lanka",
  "COT": "Cotonou, Benin",
  "CPN": "Copenhagen, Denmark",
  "CRO": "Cairo, Egypt",
  "CRS": "Caracas, Venezuela",
  "CSB": "Casablanca, Morocco",
  "DBL": "Dublin, Ireland",
  "DHB": "Dushanbe, Tajikistan",
  "DHK": "Dhaka, Bangladesh",
  "DJI": "Djibouti, Djibouti",
  "DKR": "Dakar, Senegal",
  "DMS": "Damascus, Syria",
  "DOH": "Doha, Qatar",
  "DRS": "Dar es Salaam, Tanzania",
  "FRN": "Frankfurt, Germany",
  "FTN": "Freetown, Sierra Leone",
  "GEO": "Georgetown, Guyana",
  "GTM": "Guatemala City, Guatemala",
  "GUZ": "Guangzhou, China",
  "GYQ": "Guayaquil, Ecuador",
  "HAV": "Havana, Cuba",
  "HCM": "Ho Chi Minh City, Vietnam",
  "HLS": "Helsinki, Finland",
  "HML": "Hamilton, Bermuda",
  "HNK": "Hong Kong, China",
  "HRE": "Harare, Zimbabwe",
  "ISL": "Islamabad, Pakistan",
  "JAK": "Jakarta, Indonesia",
  "JHN": "Johannesburg, South Africa",
  "JRS": "Jerusalem, Israel",
  "KBL": "Kabul, Afghanistan",
  "KDU": "Kathmandu, Nepal",
  "KEV": "Kyiv, Ukraine",
  "KGL": "Kigali, Rwanda",
  "KHT": "Khartoum, Sudan",
  "KIN": "Kinshasa, Democratic Republic of the Congo",
  "KLL": "Kuala Lumpur, Malaysia",
  "KMP": "Kampala, Uganda",
  "KNG": "Kingston, Jamaica",
  "KWT": "Kuwait, Kuwait",
  "LGS": "Lagos, Nigeria",
  "LIB": "Libreville, Gabon",
  "LIL": "Lilongwe, Malawi",
  "LJU": "Ljubljana, Slovenia",
  "LMA": "Lima, Peru",
  "LND": "London, United Kingdom",
  "LOM": "Lome, Togo",
  "LPZ": "La Paz, Bolivia",
  "LUA": "Luanda, Angola",
  "LUS": "Lusaka, Zambia",
  "MDD": "Madrid, Spain",
  "MNA": "Manama, Bahrain",
  "MNG": "Managua, Nicaragua",
  "MNL": "Manila, Philippines",
  "MOS": "Moscow, Russia",
  "MRV": "Monrovia, Liberia",
  "MST": "Muscat, Oman",
  "MTL": "Montreal, Canada",
  "MTV": "Montevideo, Uruguay",
  "NCS": "Nicosia, Cyprus",
  "NHA": "Naha, Japan",
  "NMY": "Niamey, Niger",
  "NPL": "Naples, Italy",
  "NRB": "Nairobi, Kenya",
  "NSS": "Nassau, Bahamas",
  "NWD": "New Delhi, India",
  "OSL": "Oslo, Norway",
  "OUG": "Ouagadougou, Burkina Faso",
  "PHP": "Phnom Penh, Cambodia",
  "PIA": "Praia, Cape Verde",
  "PNM": "Panama City, Panama",
  "PRG": "Prague, Czech Republic",
  "PRI": "Pristina, Kosovo",
  "PRM": "Paramaribo, Suriname",
  "PRS": "Paris, France",
  "PTM": "Port Moresby, Papua New Guinea",
  "PTP": "Port-au-Prince, Haiti",
  "PTS": "Port Of Spain, Trinidad and Tobago",
  "RDJ": "Rio De Janeiro, Brazil",
  "RGA": "Riga, Latvia",
  "RID": "Riyadh, Saudi Arabia",
  "RKJ": "Reykjavik, Iceland",
  "RNG": "Rangoon, Burma",
  "SAA": "Sanaa, Yemen",
  "SAR": "Sarajevo, Bosnia and Herzegovina",
  "SDO": "Santo Domingo, Dominican Republic",
  "SEO": "Seoul, South Korea",
  "SGP": "Singapore, Singapore",
  "SKO": "Skopje, Macedonia",
  "SNJ": "San José, Costa Rica",
  "SNT": "Santiagoi, Chile",
  "SNS": "San Salvador, El Salvador",
  "SOF": "Sofia, Bulgaria",
  "STK": "Stockholm, Sweden",
  "SUV": "Suva, Fiji",
  "SYD": "Sydney, Australia",
  "TAI": "Taipei, Taiwan",
  "TAL": "Tallinn, Estonia",
  "TBL": "Tbilisi, Georgia",
  "TGG": "Tegucigalpa, Honduras",
  "THT": "Tashkent, Uzbekistan",
  "TIA": "Tirana, Albania",
  "TKY": "Tokyo, Japan",
  "TNS": "Tunis, Tunisia",
  "TLV": "Tel Aviv, Isreal",
  "ULN": "Ulaanbaatar, Mongolia",
  "VAC": "Vancouver, Canada",
  "VIL": "Vilnius, Lithuania",
  "VNN": "Vienna, Austria",
  "VNT": "Vientiane, Laos",
  "WRW": "Warsaw, Poland",
  "YDE": "Yaounde, Cameroon",
  "YRV": "Yerevan, Armenia",
  "ZGB": "Zagreb, Croatia",
}

function App() {

  const [data, setData] = useState([]); // Массив объектов данных из CSV-файла
  const [prevdata, setprevData] = useState([]); // Массив объектов данных из CSV-файла
  const [totals, setTotals] = useState({}); // Объект с общими значениями для каждого поля

  useEffect(() => {
    async function fetchData() {
      fetch(currentCSV)
        .then(response => response.text())
        .then(responseText => {
          const parsedData = Papa.parse(responseText, { header: true }).data;
          setData(parsedData);
        })
      fetch(prevCSV)
        .then(response => response.text())
        .then(responseText => {
          const parsedData = Papa.parse(responseText, { header: true }).data;
          setprevData(parsedData);
        })
    }


    fetchData();
  }, []);

  useEffect(() => {
    const totals = [];
    regionValues.forEach((region) => {
      statusValues.forEach((status) => {
        const count = data.filter((item) => item.region === region && item.status === status).length;
        if (count > 0) {
          if (!totals[region]) {
            totals[region] = {};
          }
          totals[region][status] = count;
        }
      });

    });

    // Считаем общие значения для каждого столбца и для всей таблицы
    const totalColumnSums = {};
    const totalRowSums = {};
    let grandTotal = 0;
    regionValues.forEach((region) => {
      let rowTotal = 0;
      statusValues.forEach((status) => {
        if (totals[region] && totals[region][status]) {
          if (!totalColumnSums[status]) {
            totalColumnSums[status] = 0;
          }
          if (!totalRowSums[region]) {
            totalRowSums[region] = 0;
          }
          totalColumnSums[status] += totals[region][status];
          totalRowSums[region] += totals[region][status];
          rowTotal += totals[region][status];
          grandTotal += totals[region][status];
        }
      });
      if (rowTotal > 0) {
        if (!totalRowSums[region]) {
          totalRowSums[region] = 0;
        }
        totalRowSums[region] += rowTotal;
      }
    });
    const result = {};
    data.forEach((row) => {
      const { region, consulate, status } = row;
      if (status !== "None" && consulate !== "None") {
        if (!result[region]) result[region] = {};
        if (!result[region][consulate]) result[region][consulate] = {};
        if (!result[region][consulate][status]) result[region][consulate][status] = 0;
        result[region][consulate][status]++;
      }
    });

    const sortedData = Object.fromEntries(
      Object.entries(result).map(([key, value]) => {
        const total = Object.entries(value).reduce((acc, [k, v]) => {
          acc.Issued += v.Issued || 0;
          acc.AP += v.AP || 0;
          acc.Refused += v.Refused || 0;
          acc.Refused221g += v.Refused221g || 0;
          acc.Ready += v.Ready || 0;
          return acc;
        }, { Issued: 0, AP: 0, Refused: 0, Refused221g: 0, Ready: 0 });

        const sortedValue = Object.fromEntries(
          Object.entries(value).sort((a, b) => {
            const totalA = (a[1].Issued || 0) + (a[1].AP || 0) + (a[1].Refused || 0) + (a[1].Refused221g || 0) + (a[1].Ready || 0);
            const totalB = (b[1].Issued || 0) + (b[1].AP || 0) + (b[1].Refused || 0) + (b[1].Refused221g || 0) + (b[1].Ready || 0);
            return totalB - totalA;
          })
        );

        return [key, sortedValue];
      })
    );








    setTotals({
      ...totalColumnSums,
      ...totalRowSums,
      ...totals,
      consulates: sortedData,
      GrandTotal: grandTotal,
    });


  }, [data]);


  return (
    <div class="main-content">
      <h2 id="dv2022-daily-visa-statistics-summary-table">DV2023 Daily Visa Statistics Summary Table</h2>
      {/* <div class="highlight"><pre class="highlight"><code>Last updated on <span class="gs">September 30, 2022 11:41 PM</span>
      </code></pre></div> */}
      <table>
        <thead>
          <tr>
            <th><strong>Region</strong>
            </th>
            {statusValues.map((status) => (
              <th key={status}><strong>{status}</strong></th>
            ))}
            <th>Totals</th>
          </tr>
        </thead>
        <tbody>

          {regionValues.map((region) => (
            <tr key={region}>
              <td><strong>{region}</strong></td>
              {statusValues.map((status) => (

                < td key={`${region}-${status}`}><strong>{totals[region] && totals[region][status] ? totals[region][status] : 0}</strong></td>
              ))}
              <td><strong>{totals[region] ? Object.values(totals[region]).reduce((acc, curr) => acc + curr, 0) : 0}</strong></td>

            </tr>
          ))}
          <tr>
            <td><strong>Totals</strong></td>
            {statusValues.map((status) => (
              <td key={`${status}-total`}><strong>{totals[status] ? totals[status] : 0}</strong></td>
            ))}
            <td><strong>{totals.GrandTotal}</strong></td>
          </tr>
        </tbody>
      </table>
      <p>When the field has two lines, the first line represents the number of cases, and the second line
        represents the number of visas. Values for number of visas are displayed in <strong>bold</strong> font.
        The <strong>Transit</strong> column represent the number of cases currently in transit.</p>
      {/* <h2 id="second-notification-letters-2nls">Second Notification Letters (2NLs)</h2>
      <p>There are no 2NLs
        today. Here are the second notification letters details for each region:</p>
      <ul>
        <li>
          <p>There are no new 2NLs for the AF region today.</p>
        </li>
        <li>
          <p>There are no new 2NLs for the AS region today.</p>
        </li>
        <li>
          <p>There are no new 2NLs for the EU region today.</p>
        </li>
        <li>
          <p>There are no new 2NLs for the NA region today.</p>
        </li>
        <li>
          <p>There are no new 2NLs for the OC region today.</p>
        </li>
        <li>
          <p>There are no new 2NLs for the SA region today.</p>
        </li>
      </ul> */}
      <h2 id="statistics-per-consular-post">Statistics per consular post</h2>
      <p>The following tables show statistics per consular post. There is one summary table
        per region.</p>
      <h4 id="africa-af-region">Africa (AF) region</h4>
      <table>
        <thead>
          <tr>
            <th>Post</th>
            <th>Country</th>
            {statusForConsulate.map((status) => (
              <th key={status}>{status}</th>
            ))}
            <th>Totals</th>
          </tr>
        </thead>
        <tbody>
          {(totals && totals.consulates) && Object.entries(totals.consulates['AF'] || {}).map(([consulate, statusone]) => (
            <tr key={consulate}>
              <td><strong>{consulate}</strong></td>
              <td>{consulates[consulate]}</td>
              {statusForConsulate.map((status) => (
                <td key={status}><strong>{statusone[status] !== undefined ? statusone[status] : 0}</strong></td>
              ))}
              <td><strong>{Object.values(statusone).reduce((total, count) => total + count, 0)}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>


      <h4 id="asia-as-region">Asia (AS) region</h4>
      <table>
        <thead>
          <tr>
            <th>Post</th>
            <th>Country</th>
            {statusForConsulate.map((status) => (
              <th key={status}>{status}</th>
            ))}
            <th>Totals</th>
          </tr>
        </thead>
        <tbody>
          {(totals && totals.consulates) && Object.entries(totals.consulates['AS'] || {}).map(([consulate, statusone]) => (
            <tr key={consulate}>
              <td><strong>{consulate}</strong></td>
              <td>{consulates[consulate]}</td>
              {statusForConsulate.map((status) => (
                <td key={status}><strong>{statusone[status] !== undefined ? statusone[status] : 0}</strong></td>
              ))}
              <td><strong>{Object.values(statusone).reduce((total, count) => total + count, 0)}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>



      <h4 id="europe-eu-region">Europe (EU) region</h4>
      <table>
        <thead>
          <tr>
            <th>Post</th>
            <th>Country</th>
            {statusForConsulate.map((status) => (
              <th key={status}>{status}</th>
            ))}
            <th>Totals</th>
          </tr>
        </thead>
        <tbody>
          {(totals && totals.consulates) && Object.entries(totals.consulates['EU'] || {}).map(([consulate, statusone]) => (
            <tr key={consulate}>
              <td><strong>{consulate}</strong></td>
              <td>{consulates[consulate]}</td>
              {statusForConsulate.map((status) => (
                <td key={status}><strong>{statusone[status] !== undefined ? statusone[status] : 0}</strong></td>
              ))}
              <td><strong>{Object.values(statusone).reduce((total, count) => total + count, 0)}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>



      <h4 id="north-america-na-region">North America (NA) region</h4>
      <table>
        <thead>
          <tr>
            <th>Post</th>
            <th>Country</th>
            {statusForConsulate.map((status) => (
              <th key={status}>{status}</th>
            ))}
            <th>Totals</th>
          </tr>
        </thead>
        <tbody>
          {(totals && totals.consulates) && Object.entries(totals.consulates['NA'] || {}).map(([consulate, statusone]) => (
            <tr key={consulate}>
              <td><strong>{consulate}</strong></td>
              <td>{consulates[consulate]}</td>
              {statusForConsulate.map((status) => (
                <td key={status}><strong>{statusone[status] !== undefined ? statusone[status] : 0}</strong></td>
              ))}
              <td><strong>{Object.values(statusone).reduce((total, count) => total + count, 0)}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>


      <h4 id="oceania-oc-region">Oceania (OC) region</h4>
      <table>
        <thead>
          <tr>
            <th>Post</th>
            <th>Country</th>
            {statusForConsulate.map((status) => (
              <th key={status}>{status}</th>
            ))}
            <th>Totals</th>
          </tr>
        </thead>
        <tbody>
          {(totals && totals.consulates) && Object.entries(totals.consulates['OC'] || {}).map(([consulate, statusone]) => (
            <tr key={consulate}>
              <td><strong>{consulate}</strong></td>
              <td>{consulates[consulate]}</td>
              {statusForConsulate.map((status) => (
                <td key={status}><strong>{statusone[status] !== undefined ? statusone[status] : 0}</strong></td>
              ))}
              <td><strong>{Object.values(statusone).reduce((total, count) => total + count, 0)}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>


      <h4 id="south-america-sa-region">South America (SA) region</h4>
      <table>
        <thead>
          <tr>
            <th>Post</th>
            <th>Country</th>
            {statusForConsulate.map((status) => (
              <th key={status}>{status}</th>
            ))}
            <th>Totals</th>
          </tr>
        </thead>
        <tbody>
          {(totals && totals.consulates) && Object.entries(totals.consulates['SA'] || {}).map(([consulate, statusone]) => (
            <tr key={consulate}>
              <td><strong>{consulate}</strong></td>
              <td>{consulates[consulate]}</td>
              {statusForConsulate.map((status) => (
                <td key={status}><strong>{statusone[status] !== undefined ? statusone[status] : 0}</strong></td>
              ))}
              <td><strong>{Object.values(statusone).reduce((total, count) => total + count, 0)}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div >
  );
}
export default App;