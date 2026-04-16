"""
NLP-based Chatbot for Smart ICU Patient Queries
Provides natural language understanding for doctor queries about patient status
"""

import re
from datetime import datetime

# Try to use transformers for semantic similarity, fallback to simple keyword matching
try:
    from sentence_transformers import SentenceTransformer, util
    SEMANTIC_MODEL = SentenceTransformer('all-MiniLM-L6-v2')
    USE_SEMANTIC = True
except ImportError:
    USE_SEMANTIC = False
    print("⚠️ Semantic transformers not available, using keyword-based chatbot")


class ICUChatbot:
    """Chatbot for answering doctor queries about patient vital signs"""
    
    def __init__(self):
        self.patient_data = None
        self.conversation_history = []
        
        # Intent patterns and responses
        self.intents = {
            "heart_rate": {
                "patterns": ["heart rate", "hr", "pulse", "bpm", "how fast is heart beating", "is the pulse high"],
                "response_template": "The patient's heart rate is {heart_rate} BPM. {context}\n\n📊 Reference Ranges:\n  • Normal: 60-100 BPM\n  • Tachycardia (high): >100 BPM\n  • Bradycardia (low): <60 BPM"
            },
            "spo2": {
                "patterns": ["oxygen", "spo2", "o2 saturation", "saturation", "blood oxygen", "oxygen level"],
                "response_template": "Oxygen saturation (SpO₂) is at {spo2}%. {context}\n\n📊 Reference Ranges:\n  • Normal: 95-100%\n  • Acceptable: 90-95%\n  • Critical: <90%"
            },
            "temperature": {
                "patterns": ["temperature", "temp", "fever", "body temp", "is the patient warm"],
                "response_template": "Patient temperature is {temperature}°C. {context}\n\n📊 Reference Ranges:\n  • Normal: 36.5-37.5°C\n  • Hypothermia: <36°C\n  • Fever: >38°C"
            },
            "blood_pressure": {
                "patterns": ["blood pressure", "bp", "systolic", "diastolic", "hypertension", "pressure"],
                "response_template": "Blood pressure is {bp_systolic}/{bp_diastolic} mmHg. {context}\n\n📊 Reference Ranges:\n  • Normal: <120/<80 mmHg\n  • Elevated: 120-129/<80\n  • High: ≥130/≥80 mmHg"
            },
            "alert_status": {
                "patterns": ["alert", "risk", "danger", "critical", "emergency", "is patient safe"],
                "response_template": "Alert Status: {alert_status}. Risk Level: {risk_level}. {context}"
            },
            "patient_summary": {
                "patterns": ["summary", "overview", "status", "how is patient", "patient status", "tell me about the patient"],
                "response_template": "Patient Summary:\n{summary}"
            },
            "recommendations": {
                "patterns": ["recommend", "suggest", "what should", "action", "intervention", "what to do"],
                "response_template": "Based on current vitals:\n{recommendations}"
            }
        }

        # Prepare semantic intent embeddings if model is available
        self.intent_embeddings = {}
        if USE_SEMANTIC:
            try:
                for intent, data in self.intents.items():
                    self.intent_embeddings[intent] = SEMANTIC_MODEL.encode(
                        data["patterns"], convert_to_tensor=True
                    )
            except Exception as e:
                print(f"⚠️ Failed to build semantic intent embeddings: {e}")
                self.intent_embeddings = {}
                "patterns": ["oxygen", "spo2", "o2 saturation", "saturation"],
                "response_template": "Oxygen saturation (SpO₂) is at {spo2}%. {context}\n\n📊 Reference Ranges:\n  • Normal: 95-100%\n  • Acceptable: 90-95%\n  • Critical: <90%"
            },
            "temperature": {
                "patterns": ["temperature", "temp", "fever", "body temp"],
                "response_template": "Patient temperature is {temperature}°C. {context}\n\n📊 Reference Ranges:\n  • Normal: 36.5-37.5°C\n  • Hypothermia: <36°C\n  • Fever: >38°C"
            },
            "blood_pressure": {
                "patterns": ["blood pressure", "bp", "systolic", "diastolic"],
                "response_template": "Blood pressure is {bp_systolic}/{bp_diastolic} mmHg. {context}\n\n📊 Reference Ranges:\n  • Normal: <120/<80 mmHg\n  • Elevated: 120-129/<80\n  • High: ≥130/≥80 mmHg"
            },
            "alert_status": {
                "patterns": ["alert", "risk", "danger", "critical", "emergency"],
                "response_template": "Alert Status: {alert_status}. Risk Level: {risk_level}. {context}"
            },
            "patient_summary": {
                "patterns": ["summary", "overview", "status", "how is patient", "patient status"],
                "response_template": "Patient Summary:\n{summary}"
            },
            "recommendations": {
                "patterns": ["recommend", "suggest", "what should", "action", "intervention"],
                "response_template": "Based on current vitals:\n{recommendations}"
            }
        }
    
    def set_patient_data(self, vitals):
        """Update patient data for context-aware responses"""
        self.patient_data = vitals
    
    def _get_context(self):
        """Generate contextual information based on current vitals"""
        if not self.patient_data:
            return "No recent data available."
        
        alerts = []
        if self.patient_data.get("heart_rate", 0) > 100:
            alerts.append("High heart rate detected")
        if self.patient_data.get("heart_rate", 0) < 60:
            alerts.append("Low heart rate detected")
        if self.patient_data.get("spo2", 0) < 95:
            alerts.append("Low oxygen saturation")
        if self.patient_data.get("temperature", 0) > 37.5:
            alerts.append("Elevated temperature")
        
        context = " ".join(alerts) if alerts else "Vitals within normal range."
        return context
    
    def _get_risk_level(self):
        """Determine risk level from prediction"""
        if not self.patient_data:
            return "UNKNOWN"
        
        prediction = self.patient_data.get("prediction", 0.5)
        if prediction > 0.75:
            return "🔴 CRITICAL"
        elif prediction > 0.5:
            return "🟠 HIGH"
        elif prediction > 0.25:
            return "🟡 MODERATE"
        else:
            return "🟢 LOW"
    
    def _generate_recommendations(self):
        """Generate clinical recommendations based on vitals"""
        if not self.patient_data:
            return "Monitor patient continuously."
        
        recommendations = []
        
        if self.patient_data.get("heart_rate", 0) > 110:
            recommendations.append("• Check for arrhythmias; consider ECG monitoring")
        if self.patient_data.get("spo2", 0) < 92:
            recommendations.append("• Increase oxygen delivery; assess respiratory function")
        if self.patient_data.get("temperature", 0) > 38:
            recommendations.append("• Investigate source of fever; consider antibiotics")
        if self.patient_data.get("bp_systolic", 0) > 160:
            recommendations.append("• Monitor hypertension; consider antihypertensive review")
        
        if not recommendations:
            recommendations.append("• Continue routine monitoring")
        
        return "\n".join(recommendations)
    
    def _get_patient_summary(self):
        """Generate comprehensive patient summary"""
        if not self.patient_data:
            return "No patient data available."
        
        summary = f"""
Patient Status Report - {datetime.now().strftime("%H:%M:%S")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Heart Rate:      {self.patient_data.get('heart_rate', 'N/A')} BPM
SpO₂:            {self.patient_data.get('spo2', 'N/A')}%
Temperature:     {self.patient_data.get('temperature', 'N/A')}°C
Blood Pressure:  {self.patient_data.get('bp_systolic', 'N/A')}/{self.patient_data.get('bp_diastolic', 'N/A')} mmHg
Risk Level:      {self._get_risk_level()}
Model Type:      {self.patient_data.get('model_type', 'Unknown')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: {self._get_context()}
        """
        return summary.strip()
    
    def _match_intent(self, query):
        """Match query to intent using keyword matching or semantic similarity"""
        query_lower = query.lower()
        
# Semantic matching if available
        if USE_SEMANTIC and self.intent_embeddings:
            try:
                query_embedding = SEMANTIC_MODEL.encode(query, convert_to_tensor=True)
                best_intent = None
                best_score = -1
                
                for intent, embeddings in self.intent_embeddings.items():
                    scores = util.pytorch_cos_sim(query_embedding, embeddings)
                    score = float(scores.max())
                    if score > best_score:
                        best_score = score
                        best_intent = intent
                
                if best_intent and best_score > 0.45:
                    return best_intent
            except Exception as e:
                print(f"Semantic matching error: {e}")

        # Keyword-based matching fallback
        for intent, data in self.intents.items():
            for pattern in data["patterns"]:
                if pattern.lower() in query_lower:
                    return intent
        
        return None
    
    def respond(self, query):
        """Generate response to user query"""
        if not query or not isinstance(query, str):
            return {"error": "Invalid query", "response": "Please provide a valid question."}
        
        query = query.strip()
        if len(query) > 500:
            return {"error": "Query too long", "response": "Please keep your question under 500 characters."}
        
        # Record conversation
        self.conversation_history.append({
            "user": query,
            "timestamp": datetime.now().isoformat()
        })
        
        # Match intent
        intent = self._match_intent(query)
        
        if not intent:
            response = """I didn't understand your question. I can help with:
• Patient vital signs (heart rate, oxygen, temperature, blood pressure)
• Alert status and risk level
• Patient summary
• Clinical recommendations

Try asking: "What is the patient's heart rate?" or "Is there an alert?"
"""
            return {"intent": "unknown", "response": response}
        
        # Generate response based on intent
        response_template = self.intents[intent]["response_template"]
        
        try:
            if intent == "heart_rate":
                response = response_template.format(
                    heart_rate=self.patient_data.get("heart_rate", "N/A"),
                    context=self._get_context()
                )
            elif intent == "spo2":
                response = response_template.format(
                    spo2=self.patient_data.get("spo2", "N/A"),
                    context=self._get_context()
                )
            elif intent == "temperature":
                response = response_template.format(
                    temperature=self.patient_data.get("temperature", "N/A"),
                    context=self._get_context()
                )
            elif intent == "blood_pressure":
                response = response_template.format(
                    bp_systolic=self.patient_data.get("bp_systolic", "N/A"),
                    bp_diastolic=self.patient_data.get("bp_diastolic", "N/A"),
                    context=self._get_context()
                )
            elif intent == "alert_status":
                response = response_template.format(
                    alert_status="🔴 ALERT ACTIVE" if self.patient_data.get("alert") else "🟢 NO ALERT",
                    risk_level=self._get_risk_level(),
                    context=self._get_context()
                )
            elif intent == "patient_summary":
                response = response_template.format(
                    summary=self._get_patient_summary()
                )
            elif intent == "recommendations":
                response = response_template.format(
                    recommendations=self._generate_recommendations()
                )
            else:
                response = "Unable to process your request. Please try again."
        
        except Exception as e:
            response = f"Error generating response: {str(e)}"
        
        self.conversation_history[-1]["assistant"] = response
        
        return {
            "intent": intent,
            "response": response,
            "data": self.patient_data
        }


# Global chatbot instance
chatbot_instance = ICUChatbot()

def get_chatbot():
    """Get the global chatbot instance"""
    return chatbot_instance

def process_query(query, patient_data=None):
    """Process a query and return response"""
    chatbot = get_chatbot()
    if patient_data:
        chatbot.set_patient_data(patient_data)
    return chatbot.respond(query)
