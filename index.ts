```typescript
// Importing required modules
import * as fs from 'fs';
import * as csv from 'csv-parser';

// Defining interfaces
interface RawData {
    name: string;
    email: string;
    age: number;
    city: string;
}

interface ProcessedData {
    name: string;
    email: string;
    ageBracket: string;
    city: string;
}

// Defining constants
const AGE_BRACKETS = {
    'youth': { min: 0, max: 24 },
    'adult': { min: 25, max: 64 },
    'senior': { min: 65, max: 120 }
};

// Function to process raw data
function processRawData(rawData: RawData[]): ProcessedData[] {
    let processedData: ProcessedData[] = [];

    rawData.forEach((data) => {
        let ageBracket: string;

        // Determine age bracket
        for (let bracket in AGE_BRACKETS) {
            if (data.age >= AGE_BRACKETS[bracket].min && data.age <= AGE_BRACKETS[bracket].max) {
                ageBracket = bracket;
                break;
            }
        }

        // Process data
        processedData.push({
            name: data.name,
            email: data.email,
            ageBracket: ageBracket,
            city: data.city
        });
    });

    return processedData;
}

// Function to read CSV file
function readCSVFile(filePath: string): Promise<RawData[]> {
    let rawData: RawData[] = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                rawData.push(row);
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                resolve(rawData);
            })
            .on('error', (error) => {
                console.log('Error in reading CSV file');
                reject(error);
            });
    });
}

// Function to write data to JSON file
function writeJSONFile(filePath: string, data: ProcessedData[]): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 4), (error) => {
            if (error) {
                console.log('Error in writing JSON file');
                reject(error);
            } else {
                console.log('JSON file successfully written');
                resolve();
            }
        });
    });
}

// Main function
async function main() {
    try {
        // Read CSV file
        let rawData = await readCSVFile('rawData.csv');

        // Process raw data
        let processedData = processRawData(rawData);

        // Write data to JSON file
        await writeJSONFile('processedData.json', processedData);
    } catch (error) {
        console.error(error);
    }
}

main();
```
Цей код на TypeScript зчитує дані з файлу CSV, обробляє ці дані (визначає вікову групу на основі віку), а потім записує оброблені дані в файл JSON. Перед запуском коду вам потрібно встановити модулі 'fs' (для роботи з файлами) та 'csv-parser' (для читання файлів CSV) через npm.