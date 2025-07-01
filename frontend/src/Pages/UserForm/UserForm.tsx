import React, { useState } from 'react';
import imgFood from "../../assets/Eating.png";
import './UserForm.scss';
import {
    User,
    Weight,
    Ruler,
    VenusAndMars,
    Activity,
    Target,
    Ban,
    Heart,
    Utensils,
    Plus,
    Trash2,
    ChevronDown,
} from 'lucide-react';
import Modal from "../../Components/Modal/Modal";
import { getDietRecommendation } from '../../Services/api';


interface UserProfile {
    age: number;
    weight: number;
    height: number;
    gender: 'homme' | 'femme';
    activityLevel: 'sedentaire' | 'leger' | 'modere' | 'intense' | 'extreme';
    objective: 'perte' | 'prise' | 'maintien';
    allergies: string[];
    restrictions: string[];
    preferences: string[];
}
interface Aliment {
    nom: string;
    type: string;
    calories: number;
}

interface RecommendationData {
    calories_cible: number;
    aliments_recommandes: Aliment[];
}

type RecommendationResponse =
    | { status: 'success'; data: RecommendationData }
    | { status: 'error'; message: string };

const UserForm: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        age: 30,
        weight: 70,
        height: 175,
        gender: 'homme',
        activityLevel: 'modere',
        objective: 'maintien',
        allergies: [],
        restrictions: [],
        preferences: [],
    });

    // Pour gérer le focus et styles "focused"
    const [focusedFields, setFocusedFields] = useState<Record<string, boolean>>({
        age: false,
        weight: false,
        height: false,
        allergyInput: false,
        restrictionInput: false,
        preferenceInput: false,
    });

    const [allergyInput, setAllergyInput] = useState('');
    const [restrictionInput, setRestrictionInput] = useState('');
    const [preferenceInput, setPreferenceInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [synth, setSynth] = useState<SpeechSynthesis | null>(null);



    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setUserProfile((prev) => ({
            ...prev,
            [name]:
                name === 'age' || name === 'weight' || name === 'height'
                    ? Number(value)
                    : value,
        }));
    };
    const handleFocus = (fieldName: string) => {
        setFocusedFields((prev) => ({ ...prev, [fieldName]: true }));
    };

    const handleBlur = (fieldName: string, value: string | number | undefined) => {
        if (
            value === '' ||
            value === undefined ||
            (typeof value === 'number' && isNaN(value))
        ) {
            setFocusedFields((prev) => ({ ...prev, [fieldName]: false }));
        }
    };

    const handleAddItem = (
        type: 'allergies' | 'restrictions' | 'preferences',
        value: string,
        setValue: React.Dispatch<React.SetStateAction<string>>
    ) => {
        const trimmedValue = value.trim();
        if (trimmedValue && !userProfile[type].includes(trimmedValue)) {
            setUserProfile((prev) => ({
                ...prev,
                [type]: [...prev[type], trimmedValue],
            }));
            setValue('');
        }
    };

    const handleRemoveItem = (
        type: 'allergies' | 'restrictions' | 'preferences',
        index: number
    ) => {
        setUserProfile((prev) => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setIsModalOpen(true);

        try {
            const result = await getDietRecommendation(userProfile);
            console.log("Résultat complet de l'API:", result);
            setRecommendation({
                status: 'success',
                data: result
            });
        } catch (error) {
            setRecommendation({
                status: 'error',
                message: "Échec de la récupération des données."
            });
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (typeof window !== "undefined" && 'speechSynthesis' in window) {
            setSynth(window.speechSynthesis);
        }
    }, []);

    React.useEffect(() => {
  if (synth && recommendation && recommendation.status === 'success') {
    const frenchVoices = synth.getVoices().filter(voice =>
      voice.lang.startsWith('fr') || voice.name.includes('French')
    );

    if (frenchVoices.length > 0) {
      // Créez un message plus naturel
      const alimentsList = recommendation.data.aliments_recommandes
        .map(alim => `${alim.nom} (${alim.type}), avec ${alim.calories} kilocalories`)
        .join(', ');
      
      const message = `Votre objectif calorique est de ${recommendation.data.calories_cible} kilocalorie.  
        Suivez ces recommandations alimentaires pour atteindre votre objectif.`;

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.voice = frenchVoices[0];
      utterance.rate = 0.95; // Un peu plus lent
      utterance.pitch = 1.1;
      utterance.volume = 1;

      // Arrêtez toute parole en cours avant de commencer
      synth.cancel();
      synth.speak(utterance);
    }
  }
}, [recommendation, synth]);


    return (
        <div className="form-with-benefits">
            <div className="benefits-section">
                <img src={imgFood} alt="Street-Food" className='Image-B' />
                <h3>Pourquoi utiliser notre application ?</h3>

                <div className="benefit-item">
                    <div className="benefit-icon">✓</div>
                    <div className="benefit-content">
                        <h4>Gain de temps</h4>
                        <p>Automatisez vos processus et gagnez plusieurs heures par semaine.</p>
                    </div>
                </div>

                <div className="benefit-item">
                    <div className="benefit-icon">✓</div>
                    <div className="benefit-content">
                        <h4>Interface intuitive</h4>
                        <p>Une prise en main immédiate grâce à une interface pensée pour vous.</p>
                    </div>
                </div>

                <div className="benefit-item">
                    <div className="benefit-icon">✓</div>
                    <div className="benefit-content">
                        <h4>Support réactif</h4>
                        <p>Notre équipe est disponible pour vous aider à tout moment.</p>
                    </div>
                </div>
            </div>
            <div className="user-form-container">
                <div className="form-header">
                    <h2>Créez Votre Profil Nutritionnel</h2>
                    <p>Remplissez ce formulaire pour obtenir un plan alimentaire personnalisé</p>
                </div>

                <form onSubmit={handleSubmit} className="user-form">
                    <div className="form-section">
                        <h3>
                            <User className="icon" /> Informations de Base
                        </h3>
                        <div className="form-grid">
                            {/* Age */}
                            <div className={`form-group ${focusedFields.age || userProfile.age ? 'focused' : ''}`}>
                                <label htmlFor="age">Âge</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={userProfile.age}
                                    onChange={handleInputChange}
                                    onFocus={() => handleFocus('age')}
                                    onBlur={() => handleBlur('age', userProfile.age)}
                                    min={1}
                                    max={120}
                                    required
                                />
                                <span className="input-icon">
                                    <User size={18} />
                                </span>
                            </div>

                            {/* Weight */}
                            <div
                                className={`form-group ${focusedFields.weight || userProfile.weight ? 'focused' : ''
                                    }`}
                            >
                                <label htmlFor="weight">Poids (kg)</label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    value={userProfile.weight}
                                    onChange={handleInputChange}
                                    onFocus={() => handleFocus('weight')}
                                    onBlur={() => handleBlur('weight', userProfile.weight)}
                                    min={30}
                                    max={300}
                                    step={0.1}
                                    required
                                />
                                <span className="input-icon">
                                    <Weight size={18} />
                                </span>
                            </div>

                            {/* Height */}
                            <div
                                className={`form-group ${focusedFields.height || userProfile.height ? 'focused' : ''
                                    }`}
                            >
                                <label htmlFor="height">Taille (cm)</label>
                                <input
                                    type="number"
                                    id="height"
                                    name="height"
                                    value={userProfile.height}
                                    onChange={handleInputChange}
                                    onFocus={() => handleFocus('height')}
                                    onBlur={() => handleBlur('height', userProfile.height)}
                                    min={100}
                                    max={250}
                                    required
                                />
                                <span className="input-icon">
                                    <Ruler size={18} />
                                </span>
                            </div>

                            {/* Gender */}
                            <div className="form-group select-group">
                                <label htmlFor="gender">
                                    <VenusAndMars className="icon" />
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={userProfile.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="homme">Homme</option>
                                    <option value="femme">Femme</option>
                                </select>
                                <ChevronDown className="select-arrow" size={16} />
                            </div>


                            {/* Activity Level */}
                            <div className="form-group select-group">
                                <label htmlFor="activityLevel">
                                    <Activity className="icon" />
                                </label>
                                <select
                                    id="activityLevel"
                                    name="activityLevel"
                                    value={userProfile.activityLevel}
                                    onChange={handleInputChange}
                                >
                                    <option value="sedentaire">Sédentaire</option>
                                    <option value="leger">Léger</option>
                                    <option value="modere">Modéré</option>
                                    <option value="intense">Intense</option>
                                    <option value="extreme">Extrême</option>
                                </select>
                                <ChevronDown className="select-arrow" size={16} />
                            </div>

                            {/* Objective */}
                            <div className="form-group select-group">
                                <label htmlFor="objective">
                                    <Target className="icon" />
                                </label>
                                <select
                                    id="objective"
                                    name="objective"
                                    value={userProfile.objective}
                                    onChange={handleInputChange}
                                >
                                    <option value="perte">Perte de poids</option>
                                    <option value="prise">Prise de masse</option>
                                    <option value="maintien">Maintien</option>
                                </select>
                                <ChevronDown className="select-arrow" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Allergies */}
                    <div className="form-section">
                        <h3>Allergies Alimentaires</h3>
                        <div className="tags-input">
                            <div className={`input-group ${focusedFields.allergyInput || allergyInput ? 'focused' : ''}`}>
                                <label htmlFor="allergyInput">Ajouter une allergie</label>
                                <input
                                    type="text"
                                    id="allergyInput"
                                    value={allergyInput}
                                    onChange={(e) => setAllergyInput(e.target.value)}
                                    onFocus={() => handleFocus('allergyInput')}
                                    onBlur={() => handleBlur('allergyInput', allergyInput)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="add-button"
                                    onClick={() => handleAddItem('allergies', allergyInput, setAllergyInput)}
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <div className="tags-container">
                                {userProfile.allergies.map((allergy, index) => (
                                    <span key={index} className="tag">
                                        {allergy}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem('allergies', index)}
                                            className="remove-tag"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Restrictions */}
                    <div className="form-section">
                        <h3>
                            <Ban className="icon" /> Restrictions Alimentaires
                        </h3>
                        <div className="tags-input">
                            <div className={`input-group ${focusedFields.restrictionInput || restrictionInput ? 'focused' : ''}`}>
                                <label htmlFor="restrictionInput">Ajouter une restriction</label>
                                <input
                                    type="text"
                                    id="restrictionInput"
                                    value={restrictionInput}
                                    onChange={(e) => setRestrictionInput(e.target.value)}
                                    onFocus={() => handleFocus('restrictionInput')}
                                    onBlur={() => handleBlur('restrictionInput', restrictionInput)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="add-button"
                                    onClick={() => handleAddItem('restrictions', restrictionInput, setRestrictionInput)}
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <div className="tags-container">
                                {userProfile.restrictions.map((restriction, index) => (
                                    <span key={index} className="tag">
                                        {restriction}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem('restrictions', index)}
                                            className="remove-tag"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="form-section">
                        <h3>
                            <Heart className="icon" /> Préférences Alimentaires
                        </h3>
                        <div className="tags-input">
                            <div className={`input-group ${focusedFields.preferenceInput || preferenceInput ? 'focused' : ''}`}>
                                <label htmlFor="preferenceInput">Ajouter une préférence</label>
                                <input
                                    type="text"
                                    id="preferenceInput"
                                    value={preferenceInput}
                                    onChange={(e) => setPreferenceInput(e.target.value)}
                                    onFocus={() => handleFocus('preferenceInput')}
                                    onBlur={() => handleBlur('preferenceInput', preferenceInput)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="add-button"
                                    onClick={() => handleAddItem('preferences', preferenceInput, setPreferenceInput)}
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <div className="tags-container">
                                {userProfile.preferences.map((preference, index) => (
                                    <span key={index} className="tag">
                                        {preference}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem('preferences', index)}
                                            className="remove-tag"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="submit-button">
                        <Utensils className="icon" />
                        <span>Générer Mon Plan Nutritionnel</span>
                    </button>
                </form>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Votre Plan Nutritionnel"
                showSkeleton={loading}
            >
                {!loading && recommendation?.status === 'success' && (
                    <div className="recommendation-content">
                        <h4>Calories cibles : {recommendation.data.calories_cible} kcal</h4>

                        <div className="foods-grid">
                            {recommendation.data.aliments_recommandes.map((aliment, index) => (
                                <div key={`${aliment.nom}-${index}`} className="food-card">
                                    <div className="food-header">
                                        <h5>{aliment.nom}</h5>
                                        <span className="food-calories">{aliment.calories} kcal</span>
                                    </div>
                                    <p className="food-type">{aliment.type}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!loading && recommendation?.status === 'error' && (
                    <p className="error-message">{recommendation.message}</p>
                )}
            </Modal>

        </div>
    );
};

export default UserForm;
