import { AssessmentData } from '../types';

export function generateSummary(data: AssessmentData) {
  const { projectDescription, preferences } = data;
  
  const platformsCount = preferences.platforms.length || 1;
  const capabilitiesCount = preferences.capabilities.length || 1;
  
  const text = projectDescription.toLowerCase();
  let complexityBoost = 0;
  if (text.includes('marketplace') || text.includes('multi-vendor')) complexityBoost += 2;
  if (text.includes('real-time') || text.includes('realtime')) complexityBoost += 1;
  if (text.includes('ai') || text.includes('machine learning')) complexityBoost += 2;
  
  const score = platformsCount + (capabilitiesCount * 0.5) + complexityBoost;
  
  let complexity: 'Low' | 'Medium' | 'High' = 'Low';
  if (score > 4 && score <= 7) complexity = 'Medium';
  if (score > 7) complexity = 'High';
  
  let timeline = '';
  if (complexity === 'Low') timeline = '8–12 weeks';
  else if (complexity === 'Medium') timeline = '16–20 weeks';
  else timeline = '24–32 weeks';
  
  if (preferences.timeline === 'ASAP') {
    timeline = complexity === 'Low' ? '6-8 weeks' : complexity === 'Medium' ? '12-16 weeks' : '20-24 weeks';
  } else if (preferences.timeline === 'Flexible') {
     timeline = complexity === 'Low' ? '10-14 weeks' : complexity === 'Medium' ? '20-24 weeks' : '28-36 weeks';
  }
  
  let recommendedSolution = 'Custom Digital Platform';
  if (text.includes('health') || text.includes('doctor') || text.includes('patient') || text.includes('clinic')) {
    recommendedSolution = 'Healthcare Management Platform';
  } else if (text.includes('restaurant') || text.includes('food') || text.includes('order') || text.includes('menu')) {
    recommendedSolution = 'Restaurant Ordering & Management Platform';
  } else if (text.includes('marketplace') || text.includes('buyers') || text.includes('sellers') || text.includes('vendors')) {
    recommendedSolution = 'Multi-vendor Marketplace';
  } else if (text.includes('education') || text.includes('course') || text.includes('student') || text.includes('learning')) {
    recommendedSolution = 'Learning Management System';
  } else if (text.includes('crm') || text.includes('customer relationship') || text.includes('leads') || text.includes('sales')) {
    recommendedSolution = 'Customer Relationship Management System';
  } else if (text.includes('inventory') || text.includes('stock') || text.includes('warehouse')) {
    recommendedSolution = 'Inventory Management System';
  } else if (text.includes('logistics') || text.includes('delivery') || text.includes('fleet') || text.includes('shipment')) {
    recommendedSolution = 'Logistics Management Platform';
  } else if (text.includes('finance') || text.includes('payments') || text.includes('banking') || text.includes('lending')) {
    recommendedSolution = 'FinTech Platform';
  } else if (text.includes('employee') || text.includes('hr') || text.includes('internal team') || text.includes('operations')) {
    recommendedSolution = 'Internal Business Portal';
  }
  
  let investmentRange = '';
  if (complexity === 'Low') {
    investmentRange = '₹10–25L';
    if (preferences.budget === 'Under ₹10L') investmentRange = 'Under ₹10L (MVP Scope)';
  } else if (complexity === 'Medium') {
    investmentRange = '₹25–50L';
  } else {
    investmentRange = '₹50L+';
  }
  
  let team = ['Product Manager', 'Frontend Dev', 'Backend Dev', 'QA Engineer'];
  if (complexity === 'Medium') {
    team = ['Business Analyst', 'UI/UX Designer', 'Frontend Dev', 'Backend Dev', 'QA Engineer', 'Project Manager'];
  } else if (complexity === 'High') {
    team = ['Business Analyst', 'UI/UX Designer', '2x Frontend Dev', '2x Backend Dev', 'DevOps Engineer', 'QA Engineer', 'Project Manager'];
  }
  
  return {
    recommendedSolution,
    features: preferences.capabilities.length > 0 ? preferences.capabilities : ['Core Dashboard', 'User Authentication'],
    timeline,
    investmentRange,
    team,
    complexity,
  };
}
