/*
 * MA Health – shared catalogue of conditions, clinics and doctors.
 * Loaded by the browser (<script src="js/catalog.js">) AND by the Node server
 * (require), so the booking API can look up clinic/doctor details itself
 * instead of trusting whatever the browser sends.
 */
// Disease Database
const diseases = [
  { id: 1, name: 'Diabetes', desc: 'Chronic disease affecting blood sugar levels. Multiple types including Type 1, Type 2, and Gestational.', icon: 'droplet', about: 'A long-term condition in which the body can\'t keep blood sugar in a healthy range.', symptoms: 'Frequent urination, excessive thirst, tiredness, blurred vision, slow-healing cuts.' },
  { id: 2, name: 'Heart Disease', desc: 'Cardiovascular condition affecting heart function. Includes coronary artery disease and heart failure.', icon: 'heartpulse', about: 'Conditions affecting the heart and blood vessels, most often narrowed coronary arteries.', symptoms: 'Chest pain or pressure, shortness of breath, fatigue, palpitations, swollen ankles.' },
  { id: 3, name: 'Hypertension', desc: 'High blood pressure condition requiring management and monitoring.', icon: 'gauge', about: 'Blood pressure that stays too high, raising the risk of heart attack and stroke.', symptoms: 'Often none, so regular checks matter; severe cases can cause headaches or dizziness.' },
  { id: 4, name: 'Asthma', desc: 'Chronic respiratory condition affecting airways and breathing. Common in children and adults.', icon: 'wind', about: 'Long-term inflammation that narrows the airways and makes breathing harder.', symptoms: 'Wheezing, coughing (often at night), chest tightness, shortness of breath.' },
  { id: 5, name: 'Mental Health', desc: 'Depression, anxiety, and other mental wellness conditions affecting overall health.', icon: 'brain', about: 'Conditions such as depression and anxiety that affect mood, thinking and daily life.', symptoms: 'Persistent sadness or worry, sleep changes, low energy, trouble concentrating.' },
  { id: 6, name: 'Arthritis', desc: 'Joint inflammation condition causing pain and mobility issues. Includes osteoarthritis and rheumatoid arthritis.', icon: 'bone', about: 'Inflammation or wear of the joints, including osteoarthritis and rheumatoid arthritis.', symptoms: 'Joint pain, morning stiffness, swelling, reduced range of movement.' },
  { id: 7, name: 'Back Pain', desc: 'Spinal pain condition affecting lower, middle, or upper back regions.', icon: 'spine', about: 'Pain in the lower, middle or upper back from strain, disc problems or posture.', symptoms: 'Aching or sharp pain, stiffness, pain spreading into a leg, limited movement.' },
  { id: 8, name: 'Skin Issues', desc: 'Dermatological conditions including acne, eczema, psoriasis, and other skin problems.', icon: 'skin', about: 'Conditions such as acne, eczema and psoriasis that affect the skin.', symptoms: 'Rashes, itching, redness, dry or scaly patches, breakouts.' }
];

// Clinics by Disease with comprehensive booking URL patterns and direct booking flag
// Condition images (the same pictures on every page); local copies are used if the remote image fails.
const DISEASE_IMAGES = {
  0: 'https://nationaltoday.com/wp-content/uploads/2021/05/National-Womens-Checkup-Day-1-1200x834.jpg',
  1: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuT74ZDmhiF8JRfLnPux8V8Aoh0I4uoTD5pBPdzCfZEg&s=10',
  2: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvPJOWnPl_IrI1XeZNFgBuqE3u-UlSXAJ_ar2vgSYTog&s=10',
  3: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv4FEQDxQiD9BxJzuBUx99OmQzsu9HyPfW_HtMV4mEJg&s=10',
  4: 'https://media.self.com/photos/617811dba28304b5a601fc8c/4:3/w_2560%2Cc_limit/GettyImages-1265249194.jpg',
  5: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA-yuVxozA2MtuHUtDJESynvi6XsihwdUZuf8VRp1LrQ&s=10',
  6: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOszxzlLzMLJLJTyJOnSpDcGiGm24d2-OlOTpELJU2HA&s=10',
  7: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&h=400&q=75',
  8: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TSBZAZjbYxrGv8nkWN7KOTMO7xguy8sn3i4lIuifAQ&s=10'
};
diseases.forEach(function (d) { d.image = DISEASE_IMAGES[d.id]; d.imageFallback = 'images/disease-' + d.id + '.png'; });
const PREVENTIVE_CHECKUP = { name: 'Preventive Checkup', image: DISEASE_IMAGES[0], imageFallback: 'images/disease-0.png' };

// Wider conditions directory (Diseases page + site search). relatedDiseaseId links a condition to the
// verified clinics of a specialty that treats it; without it the page says no verified MA information was found.
const moreConditions = [
 {
  "id": 101,
  "name": "Acid Reflux (GERD)",
  "specialty": "Gastroenterology",
  "about": "Stomach acid repeatedly flows back into the food pipe, irritating its lining.",
  "symptoms": "Heartburn, sour taste in the mouth, trouble swallowing, chronic cough.",
  "relatedDiseaseId": null
 },
 {
  "id": 102,
  "name": "ADHD",
  "specialty": "Psychiatry",
  "about": "A neurodevelopmental condition affecting attention, activity levels and impulse control.",
  "symptoms": "Trouble focusing, restlessness, forgetfulness, acting without thinking.",
  "relatedDiseaseId": 5
 },
 {
  "id": 103,
  "name": "Allergies",
  "specialty": "Allergy & Immunology",
  "about": "The immune system overreacts to usually harmless substances such as pollen, dust or foods.",
  "symptoms": "Sneezing, runny or blocked nose, itchy eyes, hives; severe reactions need emergency care.",
  "relatedDiseaseId": 4
 },
 {
  "id": 104,
  "name": "Alzheimer's Disease",
  "specialty": "Neurology",
  "about": "A progressive brain disease and the most common cause of dementia.",
  "symptoms": "Memory loss, confusion, trouble with planning and language, mood changes.",
  "relatedDiseaseId": null
 },
 {
  "id": 105,
  "name": "Anemia",
  "specialty": "Hematology",
  "about": "Too few healthy red blood cells to carry enough oxygen through the body.",
  "symptoms": "Tiredness, weakness, pale skin, shortness of breath, dizziness.",
  "relatedDiseaseId": null
 },
 {
  "id": 106,
  "name": "Anxiety Disorders",
  "specialty": "Psychiatry",
  "about": "Ongoing, excessive worry or fear that interferes with daily life.",
  "symptoms": "Constant worry, restlessness, racing heart, trouble sleeping, panic attacks.",
  "relatedDiseaseId": 5
 },
 {
  "id": 107,
  "name": "Bronchitis",
  "specialty": "Pulmonology",
  "about": "Inflammation of the airways to the lungs, often after a cold; can become chronic.",
  "symptoms": "Cough with mucus, chest discomfort, tiredness, mild fever.",
  "relatedDiseaseId": 4
 },
 {
  "id": 108,
  "name": "Breast Cancer",
  "specialty": "Oncology",
  "about": "Cancer that forms in breast tissue; early detection improves outcomes.",
  "symptoms": "New lump, change in breast size or shape, skin dimpling, nipple changes.",
  "relatedDiseaseId": null
 },
 {
  "id": 109,
  "name": "Cataracts",
  "specialty": "Ophthalmology",
  "about": "Clouding of the eye's natural lens, usually developing with age.",
  "symptoms": "Blurry or dim vision, glare, faded colours, poor night vision.",
  "relatedDiseaseId": null
 },
 {
  "id": 110,
  "name": "Chronic Kidney Disease",
  "specialty": "Nephrology",
  "about": "Gradual loss of kidney function over months or years.",
  "symptoms": "Often silent early; later swelling, tiredness, changes in urination.",
  "relatedDiseaseId": null
 },
 {
  "id": 111,
  "name": "COPD",
  "specialty": "Pulmonology",
  "about": "A long-term lung disease, including emphysema and chronic bronchitis, that limits airflow.",
  "symptoms": "Shortness of breath, ongoing cough, wheezing, frequent chest infections.",
  "relatedDiseaseId": 4
 },
 {
  "id": 112,
  "name": "Crohn's Disease",
  "specialty": "Gastroenterology",
  "about": "A type of inflammatory bowel disease causing inflammation of the digestive tract.",
  "symptoms": "Diarrhoea, belly pain, weight loss, tiredness, blood in stool.",
  "relatedDiseaseId": null
 },
 {
  "id": 113,
  "name": "Depression",
  "specialty": "Psychiatry",
  "about": "A common mood disorder causing persistent sadness and loss of interest.",
  "symptoms": "Low mood, loss of interest, sleep and appetite changes, low energy.",
  "relatedDiseaseId": 5
 },
 {
  "id": 114,
  "name": "Eczema",
  "specialty": "Dermatology",
  "about": "A chronic condition that makes skin dry, itchy and inflamed.",
  "symptoms": "Itchy, dry, red or cracked patches, often in skin folds.",
  "relatedDiseaseId": 8
 },
 {
  "id": 115,
  "name": "Epilepsy",
  "specialty": "Neurology",
  "about": "A brain disorder causing repeated seizures.",
  "symptoms": "Seizures, staring spells, jerking movements, brief loss of awareness.",
  "relatedDiseaseId": null
 },
 {
  "id": 116,
  "name": "Fibromyalgia",
  "specialty": "Rheumatology",
  "about": "A long-term condition causing widespread pain and tenderness.",
  "symptoms": "Widespread pain, tiredness, poor sleep, memory and concentration problems.",
  "relatedDiseaseId": null
 },
 {
  "id": 117,
  "name": "Flu (Influenza)",
  "specialty": "Primary Care",
  "about": "A contagious respiratory infection caused by influenza viruses.",
  "symptoms": "Fever, chills, muscle aches, cough, sore throat, tiredness.",
  "relatedDiseaseId": null
 },
 {
  "id": 118,
  "name": "Glaucoma",
  "specialty": "Ophthalmology",
  "about": "Eye conditions that damage the optic nerve, often linked to high eye pressure.",
  "symptoms": "Often none early; gradual loss of side vision.",
  "relatedDiseaseId": null
 },
 {
  "id": 119,
  "name": "Gout",
  "specialty": "Rheumatology",
  "about": "A form of arthritis caused by uric acid crystals in a joint.",
  "symptoms": "Sudden, severe joint pain (often the big toe), swelling, redness, warmth.",
  "relatedDiseaseId": null
 },
 {
  "id": 120,
  "name": "Hearing Loss",
  "specialty": "Audiology / ENT",
  "about": "Reduced ability to hear, from ageing, noise, infection or other causes.",
  "symptoms": "Muffled speech, asking people to repeat, turning up the volume, ringing in the ears.",
  "relatedDiseaseId": null
 },
 {
  "id": 121,
  "name": "Hepatitis",
  "specialty": "Gastroenterology / Hepatology",
  "about": "Inflammation of the liver, most often caused by a viral infection.",
  "symptoms": "Tiredness, yellow skin or eyes, dark urine, belly pain; can be silent.",
  "relatedDiseaseId": null
 },
 {
  "id": 122,
  "name": "High Cholesterol",
  "specialty": "Cardiology",
  "about": "Too much cholesterol in the blood, raising the risk of heart disease and stroke.",
  "symptoms": "Usually none; found with a blood test.",
  "relatedDiseaseId": 2
 },
 {
  "id": 123,
  "name": "Hypothyroidism",
  "specialty": "Endocrinology",
  "about": "An underactive thyroid gland that doesn't make enough thyroid hormone.",
  "symptoms": "Tiredness, weight gain, feeling cold, dry skin, constipation.",
  "relatedDiseaseId": 1
 },
 {
  "id": 124,
  "name": "Hyperthyroidism",
  "specialty": "Endocrinology",
  "about": "An overactive thyroid gland that makes too much thyroid hormone.",
  "symptoms": "Weight loss, fast heartbeat, anxiety, tremor, feeling hot.",
  "relatedDiseaseId": 1
 },
 {
  "id": 125,
  "name": "Insomnia",
  "specialty": "Sleep Medicine",
  "about": "Ongoing trouble falling or staying asleep.",
  "symptoms": "Difficulty sleeping, waking early, daytime tiredness, irritability.",
  "relatedDiseaseId": null
 },
 {
  "id": 126,
  "name": "Irritable Bowel Syndrome",
  "specialty": "Gastroenterology",
  "about": "A common disorder affecting the large intestine.",
  "symptoms": "Belly pain, cramping, bloating, diarrhoea or constipation.",
  "relatedDiseaseId": null
 },
 {
  "id": 127,
  "name": "Kidney Stones",
  "specialty": "Urology",
  "about": "Hard deposits of minerals and salts that form inside the kidneys.",
  "symptoms": "Severe pain in the side or back, pain when urinating, blood in urine.",
  "relatedDiseaseId": null
 },
 {
  "id": 128,
  "name": "Lung Cancer",
  "specialty": "Oncology",
  "about": "Cancer that begins in the lungs; smoking is the leading risk factor.",
  "symptoms": "Persistent cough, coughing blood, chest pain, shortness of breath, weight loss.",
  "relatedDiseaseId": null
 },
 {
  "id": 129,
  "name": "Lyme Disease",
  "specialty": "Infectious Disease",
  "about": "A bacterial infection spread by tick bites, common in Massachusetts.",
  "symptoms": "Expanding 'bull's-eye' rash, fever, tiredness, joint aches.",
  "relatedDiseaseId": null
 },
 {
  "id": 130,
  "name": "Macular Degeneration",
  "specialty": "Ophthalmology",
  "about": "Damage to the central part of the retina, usually with age.",
  "symptoms": "Blurred or distorted central vision, trouble reading or recognising faces.",
  "relatedDiseaseId": null
 },
 {
  "id": 131,
  "name": "Migraine",
  "specialty": "Neurology",
  "about": "A neurological condition causing recurring, often severe headaches.",
  "symptoms": "Throbbing head pain, nausea, sensitivity to light and sound, visual aura.",
  "relatedDiseaseId": null
 },
 {
  "id": 132,
  "name": "Multiple Sclerosis",
  "specialty": "Neurology",
  "about": "A disease in which the immune system attacks the protective covering of nerves.",
  "symptoms": "Numbness, weakness, vision problems, tiredness, balance problems.",
  "relatedDiseaseId": null
 },
 {
  "id": 133,
  "name": "Obesity",
  "specialty": "Endocrinology / Primary Care",
  "about": "Excess body fat that increases the risk of other health problems.",
  "symptoms": "High body mass index; may bring joint pain, snoring, breathlessness.",
  "relatedDiseaseId": 1
 },
 {
  "id": 134,
  "name": "Osteoporosis",
  "specialty": "Endocrinology",
  "about": "Bones become weak and brittle, raising the risk of fractures.",
  "symptoms": "Often none until a fracture; loss of height, stooped posture.",
  "relatedDiseaseId": 1
 },
 {
  "id": 135,
  "name": "Parkinson's Disease",
  "specialty": "Neurology",
  "about": "A progressive disorder of the nervous system that affects movement.",
  "symptoms": "Tremor, stiffness, slow movement, balance problems.",
  "relatedDiseaseId": null
 },
 {
  "id": 136,
  "name": "Pneumonia",
  "specialty": "Pulmonology",
  "about": "An infection that inflames the air sacs in one or both lungs.",
  "symptoms": "Cough, fever, chills, shortness of breath, chest pain when breathing.",
  "relatedDiseaseId": 4
 },
 {
  "id": 137,
  "name": "Prostate Cancer",
  "specialty": "Oncology / Urology",
  "about": "Cancer in the prostate gland; often slow-growing.",
  "symptoms": "Often none early; later trouble urinating, blood in urine.",
  "relatedDiseaseId": null
 },
 {
  "id": 138,
  "name": "Psoriasis",
  "specialty": "Dermatology",
  "about": "An immune condition that speeds up skin cell growth, forming scaly patches.",
  "symptoms": "Red, thick, scaly patches, itching, nail changes.",
  "relatedDiseaseId": 8
 },
 {
  "id": 139,
  "name": "Rheumatoid Arthritis",
  "specialty": "Rheumatology",
  "about": "An autoimmune disease in which the immune system attacks the joints.",
  "symptoms": "Painful, swollen joints on both sides, morning stiffness, tiredness.",
  "relatedDiseaseId": null
 },
 {
  "id": 140,
  "name": "Shingles",
  "specialty": "Primary Care",
  "about": "A painful rash caused by reactivation of the chickenpox virus.",
  "symptoms": "Burning pain, then a blistering rash on one side of the body.",
  "relatedDiseaseId": null
 },
 {
  "id": 141,
  "name": "Sleep Apnea",
  "specialty": "Sleep Medicine",
  "about": "Breathing repeatedly stops and starts during sleep.",
  "symptoms": "Loud snoring, gasping at night, morning headaches, daytime sleepiness.",
  "relatedDiseaseId": 4
 },
 {
  "id": 142,
  "name": "Stroke",
  "specialty": "Neurology",
  "about": "Blood flow to part of the brain is blocked or a blood vessel bursts. It is an emergency.",
  "symptoms": "Face drooping, arm weakness, speech difficulty — call 911 immediately.",
  "relatedDiseaseId": null
 },
 {
  "id": 143,
  "name": "Urinary Tract Infection",
  "specialty": "Urology / Primary Care",
  "about": "An infection in any part of the urinary system, most often the bladder.",
  "symptoms": "Burning when urinating, frequent urge, cloudy urine, pelvic pain.",
  "relatedDiseaseId": null
 },
 {
  "id": 144,
  "name": "Varicose Veins",
  "specialty": "Vascular Surgery",
  "about": "Swollen, twisted veins, usually in the legs.",
  "symptoms": "Visible bulging veins, aching or heavy legs, swelling, itching.",
  "relatedDiseaseId": null
 },
 {
  "id": 145,
  "name": "Vertigo",
  "specialty": "ENT / Neurology",
  "about": "A sensation that you or your surroundings are spinning.",
  "symptoms": "Spinning dizziness, loss of balance, nausea, sometimes hearing changes.",
  "relatedDiseaseId": null
 }
];
moreConditions.forEach(function (c) { c.image = null; c.imageFallback = 'images/generic-condition.svg'; });

// Clinic and doctor details verified against official hospital directories on 22 Sep 2026.
// Ratings are shown only where the hospital itself publishes them (patient-survey scores), with their source.
const VERIFIED_ON = '22 Sep 2026';
const clinicsByDisease = {
 "1": [
  {
   "id": 11,
   "name": "Mass General Diabetes Clinical Center",
   "city": "Boston",
   "address": "50 Staniford St, Suite 340, Boston, MA 02114",
   "phone": "617-726-8722",
   "website": "https://www.massgeneral.org/endocrinology/diabetes/treatments-and-services/clinical-center",
   "sourceName": "Massachusetts General Hospital",
   "sourceUrl": "https://www.massgeneral.org/endocrinology/diabetes/treatments-and-services/clinical-center",
   "icon": "building",
   "desc": "Boston, MA",
   "email": null,
   "contactPage": "https://www.massgeneral.org/endocrinology/diabetes/treatments-and-services/clinical-center",
   "hasDirectBooking": false,
   "bookingUrls": []
  },
  {
   "id": 12,
   "name": "Brigham and Women's Endocrine Clinic",
   "city": "Boston",
   "address": "221 Longwood Ave, Floor 2, Boston, MA 02115",
   "phone": "617-732-5666",
   "website": "https://www.brighamandwomens.org/medicine/endocrinology-diabetes-and-hypertension/research-faculty",
   "sourceName": "Brigham and Women's Hospital",
   "sourceUrl": "https://www.brighamandwomens.org/medicine/endocrinology-diabetes-and-hypertension/research-faculty",
   "icon": "building",
   "desc": "Boston, MA",
   "email": null,
   "contactPage": "https://www.brighamandwomens.org/medicine/endocrinology-diabetes-and-hypertension/research-faculty",
   "hasDirectBooking": false,
   "bookingUrls": []
  },
  {
   "id": 13,
   "name": "Boston Medical Center Endocrinology, Diabetes and Nutrition",
   "city": "Boston",
   "address": "732 Harrison Ave, 2nd Floor, Boston, MA 02118",
   "phone": "617-638-7470",
   "website": "https://bmc.org/about-us/directory/doctor/katherine-l-modzelewski-md",
   "sourceName": "Boston Medical Center",
   "sourceUrl": "https://bmc.org/about-us/directory/doctor/katherine-l-modzelewski-md",
   "icon": "building",
   "desc": "Boston, MA",
   "email": null,
   "contactPage": "https://bmc.org/about-us/directory/doctor/katherine-l-modzelewski-md",
   "hasDirectBooking": false,
   "bookingUrls": []
  }
 ],
 "2": [
  {
   "id": 21,
   "name": "Tufts Medical Center CardioVascular Center",
   "city": "Boston",
   "address": "800 Washington St, Boston, MA 02111",
   "phone": null,
   "website": "https://www.tuftsmedicalcenter.org",
   "sourceName": "Tufts Medicine",
   "sourceUrl": "https://www.tuftsmedicine.org/emergency-room-employee-raised-money-hospital-saved-her-dads-life-through-boston-marathon",
   "icon": "building",
   "desc": "Boston, MA",
   "email": null,
   "contactPage": "https://www.tuftsmedicalcenter.org",
   "hasDirectBooking": false,
   "bookingUrls": []
  },
  {
   "id": 22,
   "name": "Beth Israel Deaconess Medical Center Cardiology",
   "city": "Boston",
   "address": "330 Brookline Ave, Shapiro 7, Boston, MA 02215",
   "phone": "877-667-8544",
   "website": "https://findadoc.bidmc.org/details/727",
   "sourceName": "BIDMC Find a Doctor",
   "sourceUrl": "https://findadoc.bidmc.org/details/727",
   "icon": "building",
   "desc": "Boston, MA",
   "email": null,
   "contactPage": "https://findadoc.bidmc.org/details/727",
   "hasDirectBooking": false,
   "bookingUrls": []
  },
  {
   "id": 23,
   "name": "UMass Memorial Medical Center Cardiology",
   "city": "Worcester",
   "address": "55 Lake Ave North, Worcester, MA 01655",
   "phone": null,
   "website": "https://providers.ummhealth.org/",
   "sourceName": "UMass Memorial Find a Provider",
   "sourceUrl": "https://providers.ummhealth.org/",
   "icon": "building",
   "desc": "Worcester, MA",
   "email": null,
   "contactPage": "https://providers.ummhealth.org/",
   "hasDirectBooking": false,
   "bookingUrls": []
  }
 ],
 "3": [
  {
   "id": 31,
   "name": "Mass General Division of Hypertension (Corrigan Minehan Heart Center)",
   "city": "Boston",
   "address": "32 Fruit St, Yawkey Bldg, 5th Floor, Suite 5B, Boston, MA 02114",
   "phone": "617-724-6750",
   "website": "https://www.massgeneral.org/doctors/22686/randy-zusman",
   "sourceName": "Mass General Brigham Find a Doctor",
   "sourceUrl": "https://doctors.massgeneralbrigham.org/provider/randall-mark-zusman/2997515",
   "icon": "building",
   "desc": "Boston, MA",
   "email": null,
   "contactPage": "https://www.massgeneral.org/doctors/22686/randy-zusman",
   "hasDirectBooking": false,
   "bookingUrls": []
  },
  {
   "id": 32,
   "name": "Mass General Brigham Cardiology Clinic at Newton (Newton-Wellesley)",
   "city": "Newton",
   "address": "2014 Washington St, Elfers Cardiovascular Center – 2 West, Newton, MA 02462",
   "phone": null,
   "website": "https://doctors.massgeneralbrigham.org/specialty/Cardiology/near/Newton%2C%20MA",
   "sourceName": "Mass General Brigham Find a Doctor",
   "sourceUrl": "https://doctors.massgeneralbrigham.org/specialty/Cardiology/near/Newton%2C%20MA",
   "icon": "building",
   "desc": "Newton, MA",
   "email": null,
   "contactPage": "https://doctors.massgeneralbrigham.org/specialty/Cardiology/near/Newton%2C%20MA",
   "hasDirectBooking": false,
   "bookingUrls": []
  }
 ],
 "4": [
  {
   "id": 41,
   "name": "Boston Children's Hospital Division of Pulmonary Medicine",
   "city": "Boston",
   "address": "300 Longwood Ave, Boston, MA 02115",
   "phone": "617-355-6000",
   "website": "https://www.childrenshospital.org/providers/stuart-rollins",
   "sourceName": "Boston Children's Hospital",
   "sourceUrl": "https://www.childrenshospital.org/providers/stuart-rollins",
   "icon": "building",
   "desc": "Boston, MA",
   "email": null,
   "contactPage": "https://www.childrenshospital.org/providers/stuart-rollins",
   "hasDirectBooking": false,
   "bookingUrls": []
  },
  {
   "id": 42,
   "name": "UMass Memorial Medical Center Pulmonary Medicine",
   "city": "Worcester",
   "address": "55 Lake Ave North, Worcester, MA 01655",
   "phone": null,
   "website": "https://providers.ummhealth.org/",
   "sourceName": "UMass Memorial Find a Provider",
   "sourceUrl": "https://providers.ummhealth.org/",
   "icon": "building",
   "desc": "Worcester, MA",
   "email": null,
   "contactPage": "https://providers.ummhealth.org/",
   "hasDirectBooking": false,
   "bookingUrls": []
  }
 ],
 "5": [
  {
   "id": 51,
   "name": "McLean Hospital Psychosocial Outpatient Clinic",
   "city": "Belmont",
   "address": "115 Mill St, Belmont, MA 02478",
   "phone": "617-855-2525",
   "website": "https://doctors.massgeneralbrigham.org/provider/anne-b-rose/3002809",
   "sourceName": "Mass General Brigham Find a Doctor",
   "sourceUrl": "https://doctors.massgeneralbrigham.org/provider/anne-b-rose/3002809",
   "icon": "building",
   "desc": "Belmont, MA",
   "email": null,
   "contactPage": "https://doctors.massgeneralbrigham.org/provider/anne-b-rose/3002809",
   "hasDirectBooking": false,
   "bookingUrls": []
  },
  {
   "id": 52,
   "name": "Brigham and Women's Psychiatry Clinic",
   "city": "Boston",
   "address": "221 Longwood Ave, Boston, MA 02115",
   "phone": "617-732-6753",
   "website": "https://doctors.massgeneralbrigham.org/specialty/psychiatry?page=12",
   "sourceName": "Mass General Brigham Find a Doctor",
   "sourceUrl": "https://doctors.massgeneralbrigham.org/specialty/psychiatry?page=12",
   "icon": "building",
   "desc": "Boston, MA",
   "email": null,
   "contactPage": "https://doctors.massgeneralbrigham.org/specialty/psychiatry?page=12",
   "hasDirectBooking": false,
   "bookingUrls": []
  }
 ],
 "6": [
  {
   "id": 61,
   "name": "Brigham and Women's Orthopaedics Clinic",
   "city": "Brookline",
   "address": "1285 Beacon St, Brookline, MA 02446",
   "phone": "617-732-5322",
   "website": "https://doctors.massgeneralbrigham.org/specialty/Hip%20and%20Knee%20Orthopedic%20Surgery/near/Brookline%2C%20MA",
   "sourceName": "Mass General Brigham Find a Doctor",
   "sourceUrl": "https://doctors.massgeneralbrigham.org/specialty/Hip%20and%20Knee%20Orthopedic%20Surgery/near/Brookline%2C%20MA",
   "icon": "building",
   "desc": "Brookline, MA",
   "email": null,
   "contactPage": "https://doctors.massgeneralbrigham.org/specialty/Hip%20and%20Knee%20Orthopedic%20Surgery/near/Brookline%2C%20MA",
   "hasDirectBooking": false,
   "bookingUrls": []
  },
  {
   "id": 62,
   "name": "Mass General Orthopaedic Surgery Arthroplasty Service",
   "city": "Boston",
   "address": "55 Fruit St, Yawkey Bldg, 3rd Floor, Suite 3B, Boston, MA 02114",
   "phone": null,
   "website": "https://doctors.massgeneralbrigham.org/specialty/Hip%20and%20Knee%20Orthopedic%20Surgery/near/Boston%2C%20MA",
   "sourceName": "Mass General Brigham Find a Doctor",
   "sourceUrl": "https://doctors.massgeneralbrigham.org/specialty/Hip%20and%20Knee%20Orthopedic%20Surgery/near/Boston%2C%20MA",
   "icon": "building",
   "desc": "Boston, MA",
   "email": null,
   "contactPage": "https://doctors.massgeneralbrigham.org/specialty/Hip%20and%20Knee%20Orthopedic%20Surgery/near/Boston%2C%20MA",
   "hasDirectBooking": false,
   "bookingUrls": []
  }
 ],
 "7": [
  {
   "id": 71,
   "name": "Brigham and Women's Faulkner Comprehensive Spine Center",
   "city": "Boston",
   "address": "1153 Centre St, 5 South, Boston, MA 02130",
   "phone": "617-983-7000",
   "website": "https://doctors.massgeneralbrigham.org/provider/shaina-a-lipa/3007916",
   "sourceName": "Mass General Brigham Find a Doctor",
   "sourceUrl": "https://doctors.massgeneralbrigham.org/provider/shaina-a-lipa/3007916",
   "icon": "building",
   "desc": "Boston, MA",
   "email": null,
   "contactPage": "https://doctors.massgeneralbrigham.org/provider/shaina-a-lipa/3007916",
   "hasDirectBooking": false,
   "bookingUrls": []
  },
  {
   "id": 72,
   "name": "Spaulding Rehabilitation Outpatient Clinic",
   "city": "Cambridge",
   "address": "1575 Cambridge St, Cambridge, MA 02138",
   "phone": null,
   "website": "https://doctors.massgeneralbrigham.org/specialty/Sports%20Medicine/near/Cambridge%2C%20MA",
   "sourceName": "Mass General Brigham Find a Doctor",
   "sourceUrl": "https://doctors.massgeneralbrigham.org/specialty/Sports%20Medicine/near/Cambridge%2C%20MA",
   "icon": "building",
   "desc": "Cambridge, MA",
   "email": null,
   "contactPage": "https://doctors.massgeneralbrigham.org/specialty/Sports%20Medicine/near/Cambridge%2C%20MA",
   "hasDirectBooking": false,
   "bookingUrls": []
  }
 ],
 "8": [
  {
   "id": 81,
   "name": "Mass General Dermatology Clinic",
   "city": "Boston",
   "address": "50 Staniford St, Suite 200, Boston, MA 02114",
   "phone": null,
   "website": "https://doctors.massgeneralbrigham.org/specialty/Dermatology?page=1",
   "sourceName": "Mass General Brigham Find a Doctor",
   "sourceUrl": "https://doctors.massgeneralbrigham.org/specialty/Dermatology?page=1",
   "icon": "building",
   "desc": "Boston, MA",
   "email": null,
   "contactPage": "https://doctors.massgeneralbrigham.org/specialty/Dermatology?page=1",
   "hasDirectBooking": false,
   "bookingUrls": []
  },
  {
   "id": 82,
   "name": "Brigham and Women's Dermatology Associates",
   "city": "Boston",
   "address": "221 Longwood Ave, Floor 1, Boston, MA 02115",
   "phone": "617-732-4918",
   "website": "https://doctors.massgeneralbrigham.org/specialty/Oncodermatology/near/Boston%2C%20MA",
   "sourceName": "Mass General Brigham Find a Doctor",
   "sourceUrl": "https://doctors.massgeneralbrigham.org/specialty/Oncodermatology/near/Boston%2C%20MA",
   "icon": "building",
   "desc": "Boston, MA",
   "email": null,
   "contactPage": "https://doctors.massgeneralbrigham.org/specialty/Oncodermatology/near/Boston%2C%20MA",
   "hasDirectBooking": false,
   "bookingUrls": []
  }
 ]
};

const doctorsByClinic = {
 "11": [
  {
   "id": 111,
   "name": "Dr. Aaron S. Leong",
   "credentials": "MD, MSc",
   "specialty": "Endocrinology",
   "diseases": [
    1
   ],
   "profileUrl": "https://www.massgeneralbrigham.org/en/doctors/l/aaron-leong-2999785",
   "sourceName": "Mass General Brigham",
   "rating": {
    "value": 4.9,
    "count": 113,
    "sourceName": "Mass General Brigham patient reviews",
    "sourceUrl": "https://www.massgeneralbrigham.org/en/doctors/l/aaron-leong-2999785"
   },
   "icon": "user",
   "desc": "Endocrinology • 4.9★ (113)",
   "photoUrl": "https://www.massgeneralbrigham.org/en/doctors/l/media_1ededcccbc41cf81c1e7b52cec3bd03c3018fa2c4.jpg?width=400&format=jpg&optimize=medium",
   "photoSourceName": "Mass General Brigham",
   "photoSourceUrl": "https://www.massgeneralbrigham.org/en/doctors/l/aaron-leong-2999785",
   "acceptingNew": false
  },
  {
   "id": 112,
   "name": "Dr. Camille Powe",
   "credentials": "MD",
   "specialty": "Endocrinology · diabetes in pregnancy",
   "diseases": [
    1
   ],
   "profileUrl": "https://www.massgeneralbrigham.org/en/doctors/p/camille-powe-3000348",
   "sourceName": "Mass General Brigham",
   "rating": null,
   "note": "Profile shows no published patient rating",
   "icon": "user",
   "desc": "Endocrinology · diabetes in pregnancy",
   "acceptingNew": false,
   "photoUrl": "https://www.massgeneralbrigham.org/en/doctors/p/media_141619a1059cd129014ed34faf8c76bed4b298e4d.jpg?width=400&format=jpg&optimize=medium",
   "photoSourceName": "Mass General Brigham",
   "photoSourceUrl": "https://www.massgeneralbrigham.org/en/doctors/p/camille-powe-3000348"
  }
 ],
 "12": [
  {
   "id": 121,
   "name": "Dr. Alexander Turchin",
   "credentials": "MD, MS",
   "specialty": "Endocrinology",
   "diseases": [
    1
   ],
   "profileUrl": "https://doctors.massgeneralbrigham.org/specialty/Endocrinology/near/Boston%2C%20MA?page=1",
   "sourceName": "Mass General Brigham Find a Doctor",
   "rating": {
    "value": 4.9,
    "count": 68,
    "sourceName": "Mass General Brigham patient survey",
    "sourceUrl": "https://doctors.massgeneralbrigham.org/specialty/Endocrinology/near/Boston%2C%20MA?page=1"
   },
   "icon": "user",
   "desc": "Endocrinology • 4.9★ (68)"
  },
  {
   "id": 122,
   "name": "Dr. Ellen W. Seely",
   "credentials": "MD",
   "specialty": "Endocrinology",
   "diseases": [
    1
   ],
   "profileUrl": "https://doctors.massgeneralbrigham.org/provider/ellen-w-seely/3011876",
   "sourceName": "Mass General Brigham Find a Doctor",
   "rating": null,
   "icon": "user",
   "desc": "Endocrinology"
  }
 ],
 "13": [
  {
   "id": 131,
   "name": "Dr. Katherine Modzelewski",
   "credentials": "MD",
   "specialty": "Endocrinology · diabetes technology",
   "diseases": [
    1
   ],
   "profileUrl": "https://bmc.org/about-us/directory/doctor/katherine-l-modzelewski-md",
   "sourceName": "Boston Medical Center",
   "rating": null,
   "icon": "user",
   "desc": "Endocrinology · diabetes technology"
  },
  {
   "id": 132,
   "name": "Dr. Sonia Ananthakrishnan",
   "credentials": "MD",
   "specialty": "Endocrinology · neuroendocrinology, diabetes",
   "diseases": [
    1
   ],
   "profileUrl": "https://bmc.org/about-us/directory/doctor/sonia-ananthakrishnan-md",
   "sourceName": "Boston Medical Center",
   "rating": null,
   "icon": "user",
   "desc": "Endocrinology · neuroendocrinology, diabetes"
  }
 ],
 "21": [
  {
   "id": 211,
   "name": "Dr. Michael S. Kiernan",
   "credentials": "MD, MS",
   "specialty": "Cardiology · heart failure & transplant",
   "diseases": [
    2
   ],
   "profileUrl": "https://www.tuftsmedicine.org/emergency-room-employee-raised-money-hospital-saved-her-dads-life-through-boston-marathon",
   "sourceName": "Tufts Medicine",
   "rating": null,
   "icon": "user",
   "desc": "Cardiology · heart failure & transplant"
  }
 ],
 "22": [
  {
   "id": 221,
   "name": "Dr. Joseph P. Kannam",
   "credentials": "MD",
   "specialty": "Cardiology",
   "diseases": [
    2
   ],
   "profileUrl": "https://findadoc.bidmc.org/details/727",
   "sourceName": "BIDMC Find a Doctor",
   "rating": null,
   "recognition": {
    "label": "Boston Magazine Top Doctor 2021–2025",
    "sourceName": "Boston Magazine",
    "sourceUrl": "https://bostonmagazine.com/find-a-doctor/joseph-kannam"
   },
   "icon": "user",
   "desc": "Cardiology",
   "photoUrl": "https://bomag.o0bc.com/wp-content/uploads/sites/9/2025/01/Joe-Kannam-2016-Preferred.jpg",
   "photoSourceName": "Boston Magazine Top Doctors listing",
   "photoSourceUrl": "https://www.bostonmagazine.com/find-a-doctor/?p=87807"
  }
 ],
 "23": [
  {
   "id": 231,
   "name": "Dr. Naomi F. Botkin",
   "credentials": "MD",
   "specialty": "Cardiology",
   "diseases": [
    2
   ],
   "profileUrl": "https://providers.ummhealth.org/",
   "sourceName": "UMass Memorial Find a Provider (search by name)",
   "rating": null,
   "icon": "user",
   "desc": "Cardiology"
  }
 ],
 "31": [
  {
   "id": 311,
   "name": "Dr. Randall M. Zusman",
   "credentials": "MD",
   "specialty": "Cardiology · Director, Division of Hypertension",
   "diseases": [
    3
   ],
   "profileUrl": "https://doctors.massgeneralbrigham.org/provider/randall-mark-zusman/2997515",
   "sourceName": "Mass General Brigham Find a Doctor",
   "rating": null,
   "icon": "user",
   "desc": "Cardiology · Director, Division of Hypertension"
  },
  {
   "id": 312,
   "name": "Dr. Nicholas E. Houstis",
   "credentials": "MD",
   "specialty": "Cardiology",
   "diseases": [
    3
   ],
   "profileUrl": "https://www.massgeneralbrigham.org/en/doctors/h/nicholas-houstis-3002593",
   "sourceName": "Mass General Brigham",
   "rating": {
    "value": 4.9,
    "count": 47,
    "sourceName": "Mass General Brigham patient reviews",
    "sourceUrl": "https://www.massgeneralbrigham.org/en/doctors/h/nicholas-houstis-3002593"
   },
   "icon": "user",
   "desc": "Cardiology • 4.9★ (47)",
   "photoUrl": "https://www.massgeneralbrigham.org/en/doctors/h/media_1e81590679d5c9b947b43841dc0bdc71a691ae772.jpg?width=400&format=jpg&optimize=medium",
   "photoSourceName": "Mass General Brigham",
   "photoSourceUrl": "https://www.massgeneralbrigham.org/en/doctors/h/nicholas-houstis-3002593",
   "acceptingNew": false
  }
 ],
 "32": [
  {
   "id": 321,
   "name": "Dr. Yamini S. Levitzky",
   "credentials": "MD, MPH",
   "specialty": "Cardiology",
   "diseases": [
    3
   ],
   "profileUrl": "https://doctors.massgeneralbrigham.org/provider/Yamini+S+Levitzky/258327",
   "sourceName": "Mass General Brigham Find a Doctor",
   "rating": {
    "value": 4.9,
    "count": 239,
    "sourceName": "Mass General Brigham patient survey",
    "sourceUrl": "https://doctors.massgeneralbrigham.org/specialty/Cardiology/near/Newton%2C%20MA"
   },
   "icon": "user",
   "desc": "Cardiology • 4.9★ (239)"
  }
 ],
 "41": [
  {
   "id": 411,
   "name": "Dr. Kenan Haver",
   "credentials": "MD",
   "specialty": "Pediatric Pulmonology · Director, Asthma Program",
   "diseases": [
    4
   ],
   "profileUrl": "https://childrenshospital.org/node/167052",
   "sourceName": "Boston Children's Hospital",
   "rating": null,
   "icon": "user",
   "desc": "Pediatric Pulmonology · Director, Asthma Program"
  },
  {
   "id": 412,
   "name": "Dr. Stuart Rollins",
   "credentials": "MD",
   "specialty": "Pediatric Pulmonology",
   "diseases": [
    4
   ],
   "profileUrl": "https://www.childrenshospital.org/providers/stuart-rollins",
   "sourceName": "Boston Children's Hospital",
   "rating": null,
   "icon": "user",
   "desc": "Pediatric Pulmonology"
  }
 ],
 "42": [
  {
   "id": 421,
   "name": "Dr. Stephen J. Krinzman",
   "credentials": "MD",
   "specialty": "Pulmonology · Allergy & Immunology",
   "diseases": [
    4
   ],
   "profileUrl": "https://providers.ummhealth.org/",
   "sourceName": "UMass Memorial Find a Provider (search by name)",
   "rating": {
    "value": 4.8,
    "count": 196,
    "sourceName": "UMass Memorial patient ratings",
    "sourceUrl": "https://providers.ummhealth.org/"
   },
   "icon": "user",
   "desc": "Pulmonology · Allergy & Immunology • 4.8★ (196)"
  },
  {
   "id": 422,
   "name": "Dr. Kimberly A. Fisher",
   "credentials": "MD",
   "specialty": "Pulmonology",
   "diseases": [
    4
   ],
   "profileUrl": "https://providers.ummhealth.org/",
   "sourceName": "UMass Memorial Find a Provider (search by name)",
   "rating": null,
   "icon": "user",
   "desc": "Pulmonology"
  }
 ],
 "51": [
  {
   "id": 511,
   "name": "Dr. Anne B. Rose",
   "credentials": "MD, MPH",
   "specialty": "Psychiatry",
   "diseases": [
    5
   ],
   "profileUrl": "https://doctors.massgeneralbrigham.org/provider/anne-b-rose/3002809",
   "sourceName": "Mass General Brigham Find a Doctor",
   "rating": null,
   "icon": "user",
   "desc": "Psychiatry"
  }
 ],
 "52": [
  {
   "id": 521,
   "name": "Dr. David B. Hathaway",
   "credentials": "MD",
   "specialty": "Psychiatry",
   "diseases": [
    5
   ],
   "profileUrl": "https://doctors.massgeneralbrigham.org/specialty/psychiatry?page=12",
   "sourceName": "Mass General Brigham Find a Doctor",
   "rating": null,
   "icon": "user",
   "desc": "Psychiatry"
  }
 ],
 "61": [
  {
   "id": 611,
   "name": "Dr. Matthew R. Gordon",
   "credentials": "MD",
   "specialty": "Orthopaedic Surgery · hip & knee",
   "diseases": [
    6
   ],
   "profileUrl": "https://doctors.massgeneralbrigham.org/specialty/Hip%20and%20Knee%20Orthopedic%20Surgery/near/Brookline%2C%20MA",
   "sourceName": "Mass General Brigham Find a Doctor",
   "rating": {
    "value": 4.9,
    "count": 273,
    "sourceName": "Mass General Brigham patient survey",
    "sourceUrl": "https://doctors.massgeneralbrigham.org/specialty/Hip%20and%20Knee%20Orthopedic%20Surgery/near/Brookline%2C%20MA"
   },
   "icon": "user",
   "desc": "Orthopaedic Surgery · hip & knee • 4.9★ (273)"
  }
 ],
 "62": [
  {
   "id": 621,
   "name": "Dr. Christopher M. Melnic",
   "credentials": "MD",
   "specialty": "Orthopaedic Surgery · hip & knee",
   "diseases": [
    6
   ],
   "profileUrl": "https://www.massgeneralbrigham.org/en/doctors/m/christopher-melnic-3001603",
   "sourceName": "Mass General Brigham",
   "rating": {
    "value": 4.8,
    "count": 455,
    "sourceName": "Mass General Brigham patient reviews",
    "sourceUrl": "https://www.massgeneralbrigham.org/en/doctors/m/christopher-melnic-3001603"
   },
   "icon": "user",
   "desc": "Orthopaedic Surgery · hip & knee • 4.8★ (455)",
   "photoUrl": "https://www.massgeneralbrigham.org/en/doctors/m/media_17f344ae17585fa5d93d9ef4a33673a1d78285d43.jpg?width=400&format=jpg&optimize=medium",
   "photoSourceName": "Mass General Brigham",
   "photoSourceUrl": "https://www.massgeneralbrigham.org/en/doctors/m/christopher-melnic-3001603",
   "acceptingNew": false
  }
 ],
 "71": [
  {
   "id": 711,
   "name": "Dr. Shaina A. Lipa",
   "credentials": "MD, MPH",
   "specialty": "Spine Surgery",
   "diseases": [
    7
   ],
   "profileUrl": "https://www.massgeneralbrigham.org/en/doctors/l/shaina-lipa-3007916",
   "sourceName": "Mass General Brigham",
   "rating": {
    "value": 4.8,
    "count": 86,
    "sourceName": "Mass General Brigham patient reviews",
    "sourceUrl": "https://www.massgeneralbrigham.org/en/doctors/l/shaina-lipa-3007916"
   },
   "icon": "user",
   "desc": "Spine Surgery • 4.8★ (86)",
   "photoUrl": "https://www.massgeneralbrigham.org/en/doctors/l/media_19d418d8253dd62b28171ad5a617578ca8396df98.jpg?width=400&format=jpg&optimize=medium",
   "photoSourceName": "Mass General Brigham",
   "photoSourceUrl": "https://www.massgeneralbrigham.org/en/doctors/l/shaina-lipa-3007916",
   "acceptingNew": false,
   "note": "Status field says not accepting new patients; biography text says she welcomes new patients — confirm with the clinic"
  },
  {
   "id": 712,
   "name": "Dr. Jay M. Zampini",
   "credentials": "MD",
   "specialty": "Spine Surgery",
   "diseases": [
    7
   ],
   "profileUrl": "https://doctors.massgeneralbrigham.org/specialty/Spine%20Surgery",
   "sourceName": "Mass General Brigham Find a Doctor",
   "rating": {
    "value": 4.9,
    "count": 299,
    "sourceName": "Mass General Brigham patient survey",
    "sourceUrl": "https://doctors.massgeneralbrigham.org/specialty/Spine%20Surgery"
   },
   "icon": "user",
   "desc": "Spine Surgery • 4.9★ (299)"
  }
 ],
 "72": [
  {
   "id": 721,
   "name": "Dr. Lauren E. Elson",
   "credentials": "MD",
   "specialty": "Physical Medicine & Rehabilitation",
   "diseases": [
    7
   ],
   "profileUrl": "https://doctors.massgeneralbrigham.org/specialty/Sports%20Medicine/near/Cambridge%2C%20MA",
   "sourceName": "Mass General Brigham Find a Doctor",
   "rating": {
    "value": 4.9,
    "count": 322,
    "sourceName": "Mass General Brigham patient survey",
    "sourceUrl": "https://doctors.massgeneralbrigham.org/specialty/Sports%20Medicine/near/Cambridge%2C%20MA"
   },
   "icon": "user",
   "desc": "Physical Medicine & Rehabilitation • 4.9★ (322)"
  }
 ],
 "81": [
  {
   "id": 811,
   "name": "Dr. Maria Beatrice T. Alora",
   "credentials": "MD",
   "specialty": "Dermatology",
   "diseases": [
    8
   ],
   "profileUrl": "https://doctors.massgeneralbrigham.org/specialty/Dermatology?page=1",
   "sourceName": "Mass General Brigham Find a Doctor",
   "rating": {
    "value": 4.7,
    "count": 187,
    "sourceName": "Mass General Brigham patient survey",
    "sourceUrl": "https://doctors.massgeneralbrigham.org/specialty/Dermatology?page=1"
   },
   "icon": "user",
   "desc": "Dermatology • 4.7★ (187)"
  }
 ],
 "82": [
  {
   "id": 821,
   "name": "Dr. Evan W. Piette",
   "credentials": "MD",
   "specialty": "Dermatology",
   "diseases": [
    8
   ],
   "profileUrl": "https://doctors.massgeneralbrigham.org/specialty/Dermatology/near/Boston%2C%20MA?page=1",
   "sourceName": "Mass General Brigham Find a Doctor",
   "rating": {
    "value": 4.9,
    "count": 496,
    "sourceName": "Mass General Brigham patient survey",
    "sourceUrl": "https://doctors.massgeneralbrigham.org/specialty/Dermatology/near/Boston%2C%20MA?page=1"
   },
   "icon": "user",
   "desc": "Dermatology • 4.9★ (496)"
  }
 ]
};


// Real patient comments, quoted briefly and anonymously from the linked public source.
const patientStories = [
 {
  "doctorId": 121,
  "quote": "Dr. Turchin is a very attentive and highly professional specialist.",
  "date": "16 Feb 2026",
  "sourceName": "Mass General Brigham patient review",
  "sourceUrl": "https://doctors.massgeneralbrigham.org/provider/alexander-turchin/253035"
 },
 {
  "doctorId": 321,
  "quote": "Dr Levitzky is a great provider! Careful, Caring, Empathic !",
  "date": "4 Feb 2026",
  "sourceName": "Mass General Brigham patient review",
  "sourceUrl": "https://doctors.massgeneralbrigham.org/provider/Yamini+S+Levitzky/258327"
 },
 {
  "doctorId": 821,
  "quote": "He is very kind and easy to talk to.",
  "date": "1 Apr 2026",
  "sourceName": "Mass General Brigham patient review",
  "sourceUrl": "https://doctors.massgeneralbrigham.org/provider/evan-w-piette/3001069"
 },
 {
  "doctorId": 221,
  "quote": "Knowledgeable, very professional and patient.",
  "date": null,
  "sourceName": "Boston Magazine Top Doctors listing (patient comment)",
  "sourceUrl": "https://bostonmagazine.com/find-a-doctor/?p=78390"
 }
];

// ── Listing rule ──────────────────────────────────────────────────────────────
// Doctors whose official source says they are NOT accepting new patients
// (acceptingNew: false) are never listed anywhere on the site, in search, or accepted
// by the booking API. Clinics left with no listable doctors are hidden too.
// Their records stay in this file so they can be re-listed if their status changes.
(function applyListingRule() {
  Object.keys(doctorsByClinic).forEach(function (cid) {
    doctorsByClinic[cid] = doctorsByClinic[cid].filter(function (d) { return d.acceptingNew !== false; });
    if (!doctorsByClinic[cid].length) delete doctorsByClinic[cid];
  });
  Object.keys(clinicsByDisease).forEach(function (did) {
    clinicsByDisease[did] = clinicsByDisease[did].filter(function (c) { return doctorsByClinic[c.id]; });
  });
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { diseases, clinicsByDisease, doctorsByClinic, VERIFIED_ON, patientStories, PREVENTIVE_CHECKUP, moreConditions };
}
