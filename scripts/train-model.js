import fs from 'fs';
import path from 'path';

// Read Training Dataset
const datasetPath = path.resolve('data/training-dataset.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

// Tokenizer & N-gram Generator
function tokenize(text) {
  const clean = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = clean.split(' ').filter(w => w.length > 1);
  const nGrams = [...words];

  // Add bigrams
  for (let i = 0; i < words.length - 1; i++) {
    nGrams.push(`${words[i]}_${words[i + 1]}`);
  }

  return nGrams;
}

// Build Vocabulary & TF-IDF Vectors
const vocabulary = new Set();
const docCount = dataset.length;
const docFrequencies = {};

// Pass 1: Build Vocabulary and Document Frequencies
dataset.forEach(sample => {
  const tokens = new Set(tokenize(sample.text));
  tokens.forEach(token => {
    vocabulary.add(token);
    docFrequencies[token] = (docFrequencies[token] || 0) + 1;
  });
});

const vocabList = Array.from(vocabulary);

// Calculate IDF weights
const idf = {};
vocabList.forEach(token => {
  idf[token] = Math.log((docCount + 1) / ((docFrequencies[token] || 0) + 1)) + 1;
});

// Train Naive Bayes Classifier probabilities for Department & Category
const deptCounts = {};
const categoryCounts = {};
const featureCountsByDept = {};
const featureCountsByCat = {};
const totalTokensByDept = {};
const totalTokensByCat = {};

dataset.forEach(sample => {
  const dept = sample.department;
  const cat = sample.category;
  const tokens = tokenize(sample.text);

  deptCounts[dept] = (deptCounts[dept] || 0) + 1;
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

  if (!featureCountsByDept[dept]) featureCountsByDept[dept] = {};
  if (!featureCountsByCat[cat]) featureCountsByCat[cat] = {};
  if (!totalTokensByDept[dept]) totalTokensByDept[dept] = 0;
  if (!totalTokensByCat[cat]) totalTokensByCat[cat] = 0;

  tokens.forEach(token => {
    const tfidfWeight = idf[token] || 1;
    featureCountsByDept[dept][token] = (featureCountsByDept[dept][token] || 0) + tfidfWeight;
    featureCountsByCat[cat][token] = (featureCountsByCat[cat][token] || 0) + tfidfWeight;
    totalTokensByDept[dept] += tfidfWeight;
    totalTokensByCat[cat] += tfidfWeight;
  });
});

// Export Model Weights Schema
const modelWeights = {
  version: '1.0.0-neural-tfidf',
  trainedAt: new Date().toISOString(),
  vocabulary: vocabList,
  idf,
  deptCounts,
  categoryCounts,
  featureCountsByDept,
  featureCountsByCat,
  totalTokensByDept,
  totalTokensByCat,
  docCount
};

// Write trained model weights to frontend source
const outputPath = path.resolve('frontend/src/lib/trainedModelWeights.json');
fs.writeFileSync(outputPath, JSON.stringify(modelWeights, null, 2), 'utf8');

console.log(`✅ Model successfully trained on ${docCount} campus complaints!`);
console.log(`📊 Vocabulary size: ${vocabList.length} unique n-gram features.`);
console.log(`💾 Saved trained model weights to: ${outputPath}`);
