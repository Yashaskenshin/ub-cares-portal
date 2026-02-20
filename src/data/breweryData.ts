import { Brewery } from '../types';

export const breweries: Brewery[] = [
  // North India
  { id: '1', cluster: 'North India', name: 'UNITED BREWERIES LTD - LUDHIANA', type: 'Own', shortName: 'PUL', code: '3100' },
  { id: '2', cluster: 'North India', name: 'WINSOME BREWERIES', type: 'Contract', shortName: 'WINS', code: '9105' },
  { id: '3', cluster: 'North India', name: 'WAVES BREWERIES & DISTILLERIES', type: 'Contract', shortName: 'Wave', code: '9107' },
  { id: '4', cluster: 'North India', name: 'ADIE BROSWON BREWERIES Pvt. Ltd.', type: 'Contract', shortName: 'ABB', code: '9113' },
  { id: '5', cluster: 'North India', name: 'MOUNT SHIVALIK INDUSTRIES LIMITED', type: 'Contract', shortName: 'Behroor', code: '9115' },
  
  // South India
  { id: '6', cluster: 'South India', name: 'UNITED BREWERIES LTD - DHARUHERA', type: 'Own', shortName: 'DHAR', code: '3101' },
  { id: '7', cluster: 'South India', name: 'UNITED BREWERIES LTD - RAJASTHAN', type: 'Own', shortName: 'RAJ', code: '3102' },
  { id: '8', cluster: 'South India', name: 'UNITED BREWERIES LTD - SHAHJAHANPUR', type: 'Own', shortName: 'SHAH', code: '3103' },
  { id: '9', cluster: 'South India', name: 'UNITED BREWERIES LTD - ALIGARH', type: 'Own', shortName: 'ALI', code: '3104' },
  { id: '10', cluster: 'South India', name: 'UNITED BREWERIES LTD - NANJANGUD', type: 'Own', shortName: 'CHAM', code: '3200' },
  { id: '11', cluster: 'South India', name: 'UNITED BREWERIES LTD - MALLEPALLY', type: 'Own', shortName: 'UBGD', code: '3201' },
  { id: '12', cluster: 'South India', name: 'UNITED BREWERIES LTD - NELAMANGALA', type: 'Own', shortName: 'KBDL', code: '3202' },
  { id: '13', cluster: 'South India', name: 'UNITED BREWERIES LIMITED - UB Chennai', type: 'Own', shortName: 'BALA', code: '3203' },
  { id: '14', cluster: 'South India', name: 'UNITED BREWERIES LIMITED - EMPE', type: 'Own', shortName: 'EMPE', code: '3204' },
  { id: '15', cluster: 'South India', name: 'UNITED BREWERIES LTD - PALAKKAD', type: 'Own', shortName: 'PKB', code: '3205' },
  { id: '16', cluster: 'South India', name: 'UNITED BREWERIES LTD - SRIKAKULAM', type: 'Own', shortName: 'GMR', code: '3206' },
  { id: '17', cluster: 'South India', name: 'UNITED BREWERIES LTD - MANGALORE', type: 'Own', shortName: 'MBDL', code: '3207' },
  { id: '18', cluster: 'South India', name: 'UNITED BREWERIES LTD - KOTHLAPUR', type: 'Own', shortName: 'NIZ', code: '3208' },
  { id: '19', cluster: 'South India', name: 'UNITED BREWERIES LTD - CHERTALA', type: 'Own', shortName: 'HRB', code: '3209' },
  { id: '20', cluster: 'South India', name: 'UNITED BREWERIES LTD - KALYANI', type: 'Own', shortName: 'KAL', code: '3300' },
  { id: '21', cluster: 'South India', name: 'UNITED BREWERIES LTD - PATNA', type: 'Own', shortName: 'PAT', code: '3301' },
  { id: '22', cluster: 'South India', name: 'UNITED BREWERIES LTD - ORISSA', type: 'Own', shortName: 'ORS', code: '3302' },
  { id: '23', cluster: 'South India', name: 'UNITED BREWERIES LTD - TALOJA', type: 'Own', shortName: 'BBL', code: '3400' },
  { id: '24', cluster: 'South India', name: 'UNITED BREWERIES LTD - GOA', type: 'Own', shortName: 'GOA', code: '3402' },
  { id: '25', cluster: 'South India', name: 'UNITED BREWERIES LTD - AJANTA', type: 'Own', shortName: 'AJA', code: '3403' },
  
  // West India
  { id: '26', cluster: 'West India', name: 'UNITED BREWERIES LTD - AURANGABAD', type: 'Own', shortName: 'ELLO', code: '3401' },
  { id: '27', cluster: 'West India', name: 'UNITED BREWERIES LTD - HO', type: 'Own', shortName: 'HO', code: '1000' },
  { id: '28', cluster: 'West India', name: 'AETHER BREWERIES', type: 'Contract', shortName: 'AETH', code: '9306' },
  
  // East India
  { id: '29', cluster: 'East India', name: 'KALS BREWERIES PRIVATE LIMITED', type: 'Contract', shortName: 'KALS', code: '9309' },
  { id: '30', cluster: 'East India', name: 'SUNIT BREWERIES PRIVATE LIMITED', type: 'Contract', shortName: 'SUNIT', code: '9310' },
  { id: '31', cluster: 'East India', name: 'BOKARO DISTILLERY PVT LIMITED', type: 'Contract', shortName: 'BOKARO', code: '9311' },
];

export const breweriesByCluster = {
  'North India': breweries.filter(b => b.cluster === 'North India'),
  'South India': breweries.filter(b => b.cluster === 'South India'),
  'East India': breweries.filter(b => b.cluster === 'East India'),
  'West India': breweries.filter(b => b.cluster === 'West India'),
};

export const breweryCounts = {
  'North India': 5,
  'South India': 20,
  'East India': 3,
  'West India': 3,
  'Total Owned': 22,
  'Total Contract': 9
};

