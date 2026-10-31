const crypto = require('crypto');
const express=require('express'),fs=require('fs'),path=require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const app=express(),DB=path.join(__dirname,'data','reports.json');
app.use(express.json({limit:'6mb'}));
app.use(session({
  secret: 'ecosort-demo-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(express.static(path.join(__dirname,'public')));
fs.mkdirSync(path.dirname(DB),{recursive:true});
const load=()=>{try{return JSON.parse(fs.readFileSync(DB))}catch{return[]}},save=r=>fs.writeFileSync(DB,JSON.stringify(r,null,1));
const USERS_DB = path.join(__dirname, 'data', 'users.json');

const loadUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(USERS_DB, 'utf8'));
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(USERS_DB, JSON.stringify(users, null, 2));
};
const STEPS=['Submitted','Under Review','Assigned','Collected','Completed'],TEAMS=['Team Alpha','Team Bravo','Team Green'];
// DEMO: status advances every 15s so you can watch tracking work
const step=r=>Math.min(4,Math.floor((Date.now()-r.created)/15000));
const CENTERS=[
{id:1,name:'GreenCycle Recycling Hub',cats:['recyclable','nonrecyclable'],addr:'Sector 4 Main Road',dLat:.012,dLng:.010,hours:'8am-6pm'},
{id:2,name:'E-Waste Care Point',cats:['ewaste'],addr:'Tech Park Gate 2',dLat:-.010,dLng:.015,hours:'10am-5pm'},
{id:3,name:'City Compost Yard',cats:['organic'],addr:'Old Market Lane',dLat:.006,dLng:-.014,hours:'6am-2pm'},
{id:4,name:'Safe Disposal Facility',cats:['hazardous','ewaste'],addr:'Industrial Area Phase 1',dLat:-.018,dLng:-.008,hours:'9am-4pm'},
{id:5,name:'Community Drop-off Centre',cats:['organic','recyclable','nonrecyclable'],addr:'Central Park East',dLat:.002,dLng:.004,hours:'7am-8pm'},
{id:6,name:'Municipal Landfill Transfer',cats:['nonrecyclable','hazardous'],addr:'Ring Road North',dLat:.022,dLng:-.004,hours:'8am-5pm'}];
app.get('/api/centers',(q,r)=>r.json(CENTERS));
// Mock AI: filename keywords, then colour fallback. Swap this for a real vision API call if you want.
app.post('/api/classify',(req,res)=>{const{filename='',rgb=[128,128,128]}=req.body,f=filename.toLowerCase();
 const k={organic:/food|fruit|veg|peel|leaf|banana|organic/,ewaste:/phone|battery|laptop|cable|charger|circuit|e-?waste/,hazardous:/chemical|paint|medicine|syringe|oil|hazard/,recyclable:/bottle|paper|can|glass|plastic|cardboard|carton/,nonrecyclable:/wrapper|chips|diaper|thermocol|foam/};
 let cat=Object.keys(k).find(c=>k[c].test(f)),conf=.92;
 if(!cat){const[r,g,b]=rgb;cat=g>r&&g>b?'organic':b>r&&b>g?'recyclable':(r>g+40&&r>b+40)?'hazardous':Math.max(r,g,b)<70?'ewaste':'nonrecyclable';conf=.6}
 res.json({category:cat,confidence:conf})});
app.post('/api/reports',(req,res)=>{const b=req.body;
 if(!b.name||!/^\d{10}$/.test(b.phone||''))return res.status(400).json({error:'Valid name and 10-digit phone required'});
 const list=load(),r={id:'WM-'+Date.now().toString(36).toUpperCase().slice(-6),created:Date.now(),name:b.name,phone:b.phone,category:b.category,address:b.address,lat:b.lat,lng:b.lng,details:b.details,image:b.image,team:TEAMS[Math.floor(Math.random()*3)]};
 list.push(r);save(list);res.json({id:r.id})});
app.get('/api/reports/:id',(req,res)=>{const r=load().find(x=>x.id===req.params.id.toUpperCase());
 if(!r)return res.status(404).json({error:'Report not found'});
 const s=step(r);res.json({id:r.id,category:r.category,address:r.address,created:r.created,step:s,steps:STEPS,team:s>=2?r.team:null})});
 
const CONTACT_DB = path.join(__dirname, 'data', 'contacts.json');

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body || {};

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof subject !== 'string' || !subject.trim() ||
    typeof message !== 'string' || !message.trim()
  ) {
    return res.status(400).json({
      error: 'Please enter valid contact details and a message.'
    });
  }

  try {
    const contacts = fs.existsSync(CONTACT_DB)
      ? JSON.parse(fs.readFileSync(CONTACT_DB, 'utf8'))
      : [];

    contacts.push({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString()
    });

    fs.mkdirSync(path.dirname(CONTACT_DB), { recursive: true });
    fs.writeFileSync(CONTACT_DB, JSON.stringify(contacts, null, 2));

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!'
    });
  } catch (error) {
    console.error('Contact save failed:', error);
    res.status(500).json({
      error: 'Could not save your message.'
    });
  }
});

const FEEDBACK_DB = path.join(__dirname, 'data', 'feedback.json');

app.post('/api/feedback', (req, res) => {
  const { reportId = '', rating, message } = req.body || {};

  if (
    !Number.isInteger(Number(rating)) ||
    Number(rating) < 1 ||
    Number(rating) > 5 ||
    typeof message !== 'string' ||
    !message.trim()
  ) {
    return res.status(400).json({
      error: 'Please provide a valid rating and feedback message.'
    });
  }

  try {
    const feedbackList = fs.existsSync(FEEDBACK_DB)
      ? JSON.parse(fs.readFileSync(FEEDBACK_DB, 'utf8'))
      : [];

    feedbackList.push({
      id: Date.now(),
      reportId: String(reportId).trim(),
      rating: Number(rating),
      message: message.trim(),
      createdAt: new Date().toISOString()
    });

    fs.mkdirSync(path.dirname(FEEDBACK_DB), { recursive: true });
    fs.writeFileSync(FEEDBACK_DB, JSON.stringify(feedbackList, null, 2));

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully!'
    });
  } catch (error) {
    console.error('Feedback save failed:', error);
    res.status(500).json({
      error: 'Could not save feedback.'
    });
  }
});







// USER DASHBOARD API

app.get('/api/dashboard-stats', (req, res) => {
    try {
        const reports = load();

        const totalReports = reports.length;

        const completedReports = reports.filter(
            r => step(r) === 4
        ).length;

        const pendingReports = totalReports - completedReports;

        const categoryCounts = {};

        reports.forEach(report => {
            const category = report.category || 'Other';

            categoryCounts[category] =
                (categoryCounts[category] || 0) + 1;
        });

        const recentReports = reports
            .slice()
            .sort((a, b) => b.created - a.created)
            .slice(0, 5)
            .map(r => ({
                id: r.id,
                name: r.name,
                category: r.category,
                address: r.address,
                status: STEPS[step(r)],
                created: r.created
            }));

        res.json({
            success: true,
            totalReports,
            completedReports,
            pendingReports,
            categoryCounts,
            recentReports
        });

    } catch (error) {
        console.error('Dashboard error:', error);

        res.status(500).json({
            success: false,
            message: 'Dashboard data could not be loaded'
        });
    }
});
// USER REGISTRATION API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const users = loadUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (users.find(user => user.email === cleanEmail)) {
      return res.status(409).json({
        success: false,
        message: 'Account already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: crypto.randomUUID(),
      name: name || '',
      email: cleanEmail,
      password: hashedPassword
    };

    users.push(newUser);
    saveUsers(users);

    req.session.userId = newUser.id;

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});
// USER LOGIN API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const users = loadUsers();
    const cleanEmail = email.trim().toLowerCase();

    const user = users.find(u => u.email === cleanEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    req.session.userId = user.id;

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});
// USER REGISTRATION API
app.post('/api/auth/register', async (req, res) => {
   // registration code
});

// USER LOGIN API
app.post('/api/auth/login', async (req, res) => {
   // login code
});

app.listen(3000,()=>console.log('EcoSort running -> http://localhost:3000'));
app.listen(3000,()=>console.log('EcoSort running -> http://localhost:3000'));

