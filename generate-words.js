const fs = require('fs');

function generateMisspellings(word, numberOfVariations) {
    const variations = [];
    for (let i = 0; i < numberOfVariations; i++) {
        const charIndex = Math.floor(Math.random() * word.length);
        let newWord;
        const randomChoice = Math.random();

        if (randomChoice < 0.33) {
            const charCode = word.charCodeAt(charIndex);
            const newChar = Math.random() > 0.5 ?
                String.fromCharCode(charCode + 1) :
                String.fromCharCode(charCode - 1);
            newWord = word.substring(0, charIndex) + newChar + word.substring(charIndex + 1);
        } else if (randomChoice < 0.66 && word.length > 1) {
            newWord = word.substring(0, charIndex) + word.substring(charIndex + 1);
        } else {
            const charCode = word.charCodeAt(charIndex);
            const additionalChar = Math.random() > 0.5 ?
                String.fromCharCode(charCode + 1) :
                String.fromCharCode(charCode - 1);
            newWord = word.substring(0, charIndex) + additionalChar + word.substring(charIndex);
        }

        if (!variations.includes(newWord)) {
            variations.push(newWord);
        } else {
            i--; // Decrement to retry for unique variation
        }
    }

    return variations;
}

function processWords(inputFilePath, outputFilePath, numberOfVariations) {
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        const words = data.split('\n').filter(Boolean); // Split by new line and remove empty lines
        const result = {};

        words.forEach(word => {
            result[word] = generateMisspellings(word, numberOfVariations);
        });

        fs.writeFile(outputFilePath, JSON.stringify(result, null, 2), 'utf8', err => {
            if (err) {
                console.error('Error writing to file:', err);
                return;
            }
            console.log('Output successfully written to', outputFilePath);
        });
    });
}

// Example usage
const inputFilePath = 'words.txt'; // The input text file path
const outputFilePath = 'output.json'; // The output JSON file path
const numberOfVariations = 6; // Generate N misspellings for each word
processWords(inputFilePath, outputFilePath, numberOfVariations);

