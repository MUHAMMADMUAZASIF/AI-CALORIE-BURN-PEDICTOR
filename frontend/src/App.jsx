import { useState } from 'react';
import './App.css';

function App() {
  const [theme, setTheme] = useState('cyan');
  const [formData, setFormData] = useState({
    gender: 'Male',
    age: 25,
    height: 170,
    weight: 70,
    duration: 30,
    heart_rate: 100,
    body_temp: 38.5,
    goal: 'Weight Loss'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/predict_calories/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setResult(Math.round(data.calories_burned));
    } catch (error) {
      console.error('Error making prediction:', error);
      setApiError('Unable to connect to prediction engine. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getNutritionPlan = () => {
    if (result === null) return { text: '', foods: [] };

    const { goal } = formData;
    let intensity = 'light';
    if (result > 300) {
      intensity = 'high';
    } else if (result >= 150) {
      intensity = 'moderate';
    }

    // Goal + Intensity matrix
    const plans = {
      'Weight Loss': {
        light: {
          text: `Light burn (${result} kcal). Maintain a calorie deficit with nutrient-dense, low-GI foods and high hydration.`,
          foods: [
            {
              title: 'Infused Lemon Water',
              desc: 'Boosts hydration with zero caloric load.',
              img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Crisp Green Apple',
              desc: 'High fiber, curbs appetite effectively.',
              img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Cucumber & Celery Sticks',
              desc: 'High water volume and essential micronutrients.',
              img: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Organic Green Tea',
              desc: 'Rich in EGCG catechins to support oxidation.',
              img: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600&auto=format&fit=crop&q=80'
            }
          ]
        },
        moderate: {
          text: `Moderate burn (${result} kcal). Target lean proteins and high-fiber veggies to replenish energy without surplus calories.`,
          foods: [
            {
              title: 'Grilled Herb Chicken Breast',
              desc: 'Pure lean protein to preserve lean mass.',
              img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Steamed Broccoli & Greens',
              desc: 'High fiber, micronutrient dense recovery.',
              img: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Hard-Boiled Egg Whites',
              desc: 'Bioavailable amino acids with minimal fat.',
              img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Mixed Forest Berries',
              desc: 'Antioxidants with a very low glycemic load.',
              img: 'https://images.unsplash.com/photo-1577069808021-5f2f54070a24?w=600&auto=format&fit=crop&q=80'
            }
          ]
        },
        high: {
          text: `High burn (${result} kcal). Strict recovery protocol: lean protein and controlled complex carbs to avoid metabolic slowdown.`,
          foods: [
            {
              title: 'Seared Wild Salmon',
              desc: 'Omega-3 fatty acids to reduce workout inflammation.',
              img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Steamed Quinoa Bowl',
              desc: 'Clean, slow-burning complex carbohydrates.',
              img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Whey Protein Isolate',
              desc: 'Rapid muscle repair with near-zero fat and sugar.',
              img: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Baby Spinach & Kale Salad',
              desc: 'Restores vital electrolytes and iron lost in sweat.',
              img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80'
            }
          ]
        }
      },
      'Muscle Gain': {
        light: {
          text: `Light activity (${result} kcal). Supply baseline amino acids and moderate carbs to sustain muscular anabolism.`,
          foods: [
            {
              title: 'Greek Yogurt with Honey',
              desc: 'Sustained casein protein release with clean fuel.',
              img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Raw Almonds & Walnuts',
              desc: 'Calorie-dense healthy monounsaturated fats.',
              img: 'https://images.unsplash.com/photo-1508061252445-564b882c3f5a?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Fresh Banana',
              desc: 'Readily available potassium and quick carbs.',
              img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Whole Milk',
              desc: 'Balanced combination of fats and proteins.',
              img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80'
            }
          ]
        },
        moderate: {
          text: `Moderate session (${result} kcal). Replenish muscular glycogen immediately and trigger mTOR protein synthesis.`,
          foods: [
            {
              title: 'Flank Steak & Rice',
              desc: 'Natural creatine, iron, and fast glycogen restoration.',
              img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Whole Eggs & Avocado Toast',
              desc: 'Complete amino acid profile plus healthy lipid profile.',
              img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Baked Sweet Potato',
              desc: 'Dense glycogen reload to fuel tomorrow’s lifts.',
              img: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Oatmeal with Peanut Butter',
              desc: 'Hearty mass-building complex carbohydrate matrix.',
              img: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=600&auto=format&fit=crop&q=80'
            }
          ]
        },
        high: {
          text: `Intense breakdown (${result} kcal). Supercompensation protocol required: high protein, fast carbs, and electrolyte replenishment.`,
          foods: [
            {
              title: 'Dual-Source Protein Shake',
              desc: 'Whey + banana + peanut butter for fast recovery.',
              img: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Tender Chicken Breast & Jasmine Rice',
              desc: 'Classic bodybuilding standard for lean hypertrophy.',
              img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Electrolyte Coconut Water',
              desc: 'Restores intracellular fluid balance and prevents cramps.',
              img: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Salmon Filet & Red Potatoes',
              desc: 'Full muscular repair with essential micronutrients.',
              img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80'
            }
          ]
        }
      },
      'Maintain': {
        light: {
          text: `Light burn (${result} kcal). Balanced maintenance snack to keep energy stable throughout the day.`,
          foods: [
            {
              title: 'Mixed Mixed Tree Nuts',
              desc: 'Steady, non-spiking sustained energy.',
              img: 'https://images.unsplash.com/photo-1508061252445-564b882c3f5a?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Crisp Red Apple & Almond Butter',
              desc: 'Even mix of soluble fiber and healthy fats.',
              img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Matcha Green Tea',
              desc: 'Calm, focused alertness without jitters.',
              img: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Low-Fat Cottage Cheese',
              desc: 'High protein dairy snack for steady satiety.',
              img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80'
            }
          ]
        },
        moderate: {
          text: `Moderate expenditure (${result} kcal). Balanced 40/30/30 macronutrient profile to maintain stable body composition.`,
          foods: [
            {
              title: 'Mediterranean Chicken Bowl',
              desc: 'Even split of lean poultry, olive oil, and brown rice.',
              img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Fresh Banana & Greek Yogurt',
              desc: 'Replenishes expended glycogen and guards muscle.',
              img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Boiled Free-Range Eggs',
              desc: 'High biological value protein and choline.',
              img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Electrolyte Mineral Water',
              desc: 'Keeps plasma volume optimal post-exercise.',
              img: 'https://images.unsplash.com/photo-1559839914-1b39922c2a04?w=600&auto=format&fit=crop&q=80'
            }
          ]
        },
        high: {
          text: `Heavy expenditure (${result} kcal). Full energy parity replenishment to prevent weight loss and fatigue.`,
          foods: [
            {
              title: 'Grilled Salmon & Brown Rice',
              desc: 'High quality proteins and long-chain carbohydrates.',
              img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Roasted Sweet Potato & Greens',
              desc: 'Starchy carb reload with rich micronutrient support.',
              img: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Complete Protein Smoothie',
              desc: 'Fruits, milk, and whey protein for full-spectrum recovery.',
              img: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80'
            },
            {
              title: 'Avocado & Whole Grain Toast',
              desc: 'Replenishes energy balance with heart-healthy monounsaturates.',
              img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80'
            }
          ]
        }
      }
    };

    return plans[goal]?.[intensity] || plans['Maintain']['moderate'];
  };

  const plan = getNutritionPlan();

  return (
    <div className={`app-wrapper theme-${theme}`}>
      {/* NAVBAR */}
      <nav className="top-navbar">
        <div className="nav-logo">
          <span className="logo-icon">🧬</span> Smart Fitness Lab
        </div>
        <div className="theme-switcher">
          <span>Theme:</span>
          <button
            onClick={() => setTheme('cyan')}
            className={`color-dot cyan ${theme === 'cyan' ? 'active' : ''}`}
            aria-label="Cyan theme"
          ></button>
          <button
            onClick={() => setTheme('green')}
            className={`color-dot green ${theme === 'green' ? 'active' : ''}`}
            aria-label="Green theme"
          ></button>
          <button
            onClick={() => setTheme('pink')}
            className={`color-dot pink ${theme === 'pink' ? 'active' : ''}`}
            aria-label="Pink theme"
          ></button>
        </div>
      </nav>

      {/* FULL SCREEN MAIN CONTAINER */}
      <div className="main-full-container">
        <div className="header">
          <h1>Biometric Engine</h1>
          <p>AI-Powered Calorie Analysis</p>
        </div>

        {apiError && (
          <div className="error-banner" style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '1.5rem' }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="premium-form">
          <div className="form-section">
            <h3>👤 Personal Profile</h3>
            <div className="input-grid">
              <div className="input-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="input-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="10"
                  max="100"
                  required
                />
              </div>
              <div className="input-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="50"
                  max="250"
                  required
                />
              </div>
              <div className="input-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="20"
                  max="300"
                  required
                />
              </div>
            </div>
          </div>

          <hr className="divider" />

          <div className="form-section">
            <h3>🏃 Workout Metrics</h3>
            <div className="input-grid">
              <div className="input-group">
                <label>Duration (min)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  max="300"
                  required
                />
              </div>
              <div className="input-group">
                <label>Avg Heart Rate</label>
                <input
                  type="number"
                  name="heart_rate"
                  value={formData.heart_rate}
                  onChange={handleChange}
                  min="40"
                  max="220"
                  required
                />
              </div>
              <div className="input-group">
                <label>Body Temp (°C)</label>
                <input
                  type="number"
                  name="body_temp"
                  step="0.1"
                  value={formData.body_temp}
                  onChange={handleChange}
                  min="35"
                  max="43"
                  required
                />
              </div>
              <div className="input-group">
                <label>Primary Goal</label>
                <select name="goal" value={formData.goal} onChange={handleChange}>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Maintain">Maintain Weight</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="predict-btn" disabled={loading}>
            {loading ? 'Processing Data...' : 'Calculate Calorie Burn'}
          </button>
        </form>

        {/* DASHBOARD RESULTS */}
        {result !== null && (
          <div className="results-container fade-in">
            <hr className="divider" />

            <div className="score-display">
              <h2>
                {result} <span className="unit">kcal</span>
              </h2>
              <p className="subtitle">Total Energy Expended</p>
            </div>

            <div className="content-section">
              <h4>🔥 Energy Equivalents</h4>
              <div className="eq-cards">
                <div className="eq-card">
                  <span className="eq-icon">🫓</span>
                  <div className="eq-info">
                    <span className="eq-value">{(result / 100).toFixed(1)}</span>
                    <span className="eq-label">Slices of Bread</span>
                  </div>
                </div>
                <div className="eq-card">
                  <span className="eq-icon">🍔</span>
                  <div className="eq-info">
                    <span className="eq-value">{(result / 250).toFixed(1)}</span>
                    <span className="eq-label">Cheeseburgers</span>
                  </div>
                </div>
                <div className="eq-card">
                  <span className="eq-icon">☕</span>
                  <div className="eq-info">
                    <span className="eq-value">{(result / 80).toFixed(1)}</span>
                    <span className="eq-label">Sugary Coffees</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-section">
              <h4>🥗 Comprehensive Recovery Plan</h4>
              <p className="goal-text">{plan.text}</p>

              <div className="premium-food-grid">
                {plan.foods.map((food, index) => (
                  <div className="food-image-card" key={index}>
                    <div className="image-wrapper">
                      <img
                        src={food.img}
                        alt={food.title}
                        loading="lazy"
                        onError={(e) => {
                          // Fallback placeholder if connection drops
                          e.target.src = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                    <div className="food-info">
                      <span className="food-title">{food.title}</span>
                      <span className="food-desc">{food.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;