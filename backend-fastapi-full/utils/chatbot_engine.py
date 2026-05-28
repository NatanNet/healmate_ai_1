"""Chatbot engine dengan if-else logic dan emotion detection - Tema Gen Z Breakup"""

from typing import Dict, Tuple
import random

class EmotionDetector:
    """Detect emotion dari user message - Focus pada breakup context"""
    
    # Anger keywords (frustration, betrayal, resentment)
    ANGER_KEYWORDS = [
        "marah", "anger", "angry", "geram", "kesal", "jengkel", "sakti",
        "benci", "hate", "jahat", "jauh", "pergi", "tinggal", "curang", "selingkuh",
        "bohong", "lies", "manipulate", "egois", "egocentric", "tidak pedulian",
        "tidak mengerti", "tidak menghargai", "tidak mendengarkan", "jahat banget",
        "biadab", "tidak manusia", "toxic", "merah", "red flag", "tidak pantas",
        "kecewa", "disappointed", "frustrasi", "frustrated", "kesal banget",
        "dendam", "revenge", "ingin balas", "payback", "tidak terima", "melawan"
    ]
    
    # Anxiety keywords (worry, overthinking, uncertainty, fear)
    ANXIETY_KEYWORDS = [
        "anxious", "cemas", "khawatir", "worried", "takut", "afraid",
        "nervous", "gugup", "gelisah", "resah", "panik", "panic",
        "deg-degan", "was-was", "ragu", "doubt", "bingung", "confused",
        "stress", "stressed", "tertekan", "pressure", "overwhelmed",
        "overthinking", "pusing", "sulit tidur", "insomnia", "mikir terus",
        "apa kabar dia", "dia kemana", "dia sama siapa", "apakah dia bahagia",
        "gimana caranya", "bagaimana", "haruskah", "sebaiknya", "apa yang harus",
        "tidak tahu", "tidak yakin", "rasa takut", "takut kesepian", "takut sendiri"
    ]
    
    # Acceptance keywords (moving forward, healing, strength, peace)
    ACCEPTANCE_KEYWORDS = [
        "move on", "maju", "terima", "ikhlas", "syukur", "baik-baik saja",
        "better", "lebih baik", "lega", "merasa ringan", "kuat", "strong",
        "optimis", "semangat", "bisa", "berhasil", "sukses", "bangga", "proud",
        "mampu", "percaya diri", "yakin", "fokus", "healing", "sembuh",
        "bahagia", "happy", "senang", "puas", "content", "damai", "peace",
        "belajar", "lesson", "growth", "berkembang", "improve", "lebih kuat",
        "self-care", "treat myself", "hobby", "fokus diri sendiri", "me time"
    ]
    
    @staticmethod
    def detect(message: str) -> Tuple[str, float]:
        """
        Detect emotion dari message
        Return: (emotion, confidence) dimana confidence 0.0 - 1.0
        """
        message_lower = message.lower()
        
        # Count keywords
        anger_count = sum(1 for kw in EmotionDetector.ANGER_KEYWORDS if kw in message_lower)
        anxiety_count = sum(1 for kw in EmotionDetector.ANXIETY_KEYWORDS if kw in message_lower)
        acceptance_count = sum(1 for kw in EmotionDetector.ACCEPTANCE_KEYWORDS if kw in message_lower)
        
        # Tentukan emotion berdasarkan count tertinggi
        max_count = max(anger_count, anxiety_count, acceptance_count)
        
        if max_count == 0:
            # Neutral - default anxiety untuk breakup context
            return "anxiety", 0.6
        
        if anger_count == max_count and anger_count > 0:
            confidence = min(0.95, 0.5 + (anger_count * 0.15))
            return "anger", confidence
        elif anxiety_count == max_count and anxiety_count > 0:
            confidence = min(0.95, 0.5 + (anxiety_count * 0.15))
            return "anxiety", confidence
        elif acceptance_count == max_count and acceptance_count > 0:
            confidence = min(0.95, 0.5 + (acceptance_count * 0.15))
            return "acceptance", confidence
        
        return "anxiety", 0.6


class ChatbotEngine:
    """Chatbot untuk Gen Z yang sedang healing dari putus cinta"""
    
    RESPONSES = {
        # Greeting - sambutan awal
        "greeting": {
            "anger": [
                "Halo! Kelihatan emosi tinggi banget. Mau curhat apa yang terjadi?",
                "Halooo, ada yang provoke banget ya? Cerita sini, dengarkan aku.",
                "Hai! Kayak ada yang annoying. Apa yang bikin kamu marah gini?",
                "Halo, kelihatan geram banget. Ada apa sih?",
            ],
            "anxiety": [
                "Halo! Kayaknya ada yang bikin kamu overthinking? Cerita yuk.",
                "Halooo, ada yang mengganggu pikiran? Kita pikirin bareng.",
                "Hai! Kelihatan gelisah. Apa yang lagi di kepala kamu?",
                "Halo, ada yang bisa aku bantu buat kurangin kekhawatiranmu?",
            ],
            "acceptance": [
                "Halooo! Wah energi positif banget! Gimana kabar healing-mu? 💪",
                "Hai! Kelihatannya hari ini lebih baikan, ya? Proud of you!",
                "Halo kak! Semangat lagi kelihatannya. Mau cerita?",
                "Heyy! Ada yang berubah positif nih. Apa aja?",
            ]
        },
        
        # Asking for support/help
        "asking_help": {
            "anger": [
                "Tenang dulu, aku siap bantu. Tapi mari kita pakai pikiran jernih, oke?",
                "Okeh, aku dengarkan. Tapi jangan buat keputusan gegabah dulu, ya.",
                "Aku di sini. Mari kita cariin solusi yang sehat, bukan reaction.",
                "Baik, cerita dulu sebelum kamu ambil keputusan yang disesali nanti.",
            ],
            "anxiety": [
                "Tenang, kita cari solusi bareng-bareng, oke? Apa yang khawatir?",
                "Aku dengarkan. Cerita aja apa yang bikin kamu galau gini.",
                "Gpp overthink, itu normal. Tapi mari kita breakdown bareng.",
                "Okeh, mari kita clear up confusion kamu. Apa yang bikin bingung?",
            ],
            "acceptance": [
                "Mantap! Bagus kamu punya inisiatif! Apa yang perlu dibantu?",
                "Wah semangat healing-mu bagus banget! Yuk kita cari solusi.",
                "Yes! Aku suka ini. Cerita saja, aku siap dengarkan.",
                "Okeh kak! Aku bersama-sama sama kamu. Apa yang bisa aku lakukan?",
            ]
        },
        
        # Breakup - heartbreak
        "breakup": {
            "anger": [
                "Kecewa dengan dia? Bisa aku mengerti, tapi jangan lakukan sesuatu yang disesali.",
                "Marah itu sah, tapi ingat: best revenge adalah kamu yang lebih baik tanpa dia.",
                "Dia berhasil bikin kamu marah, huh? Mari kita channel energi ini jadi hal positif.",
                "Rasa pengkhianatan itu real. Tapi kamu lebih dari ini, jangan down gara-gara dia.",
            ],
            "anxiety": [
                "Stop overthinking tentang tentang dia, okay? Fokus sama diri sendiri dulu.",
                "Gpp merasa confused sekarang. Butuh waktu buat terima ini semua.",
                "Ada banyak pertanyaan yang tidak mungkin terjawab. Mari kita let go bareng.",
                "Galau tentang 'apa yang salah'? Stop. Ini bukan tentang 'salah', ini tentang move on.",
            ],
            "acceptance": [
                "Proud of you! Move on dengan kepala tinggi itu berat banget, kamu bisa!",
                "Yess! Liat, kamu udah bisa tersenyum lagi. Progress banget nih!",
                "Bagus! Kamu deserve yang lebih baik kok, percaya diri terus!",
                "Lanjutin momentum ini! Kamu berharga banget, jangan lupa itu!",
            ]
        },
        
        # Missing ex / stalking
        "missing_ex": {
            "anger": [
                "Teringat hal-hal yang bikin marah? Itu normal tapi jangan di-stalk gara-gara itu.",
                "Pengen tahu apa dia alami sekarang? Biarin aja. Focus pada diri sendiri.",
                "Dendam ke dia? Gpp merasakan tapi jangan jadi obsesi, itu kasihan diri sendiri.",
                "Lihat dia happy? Biarin. Kamu juga bisa lebih happy tanpa dia.",
            ],
            "anxiety": [
                "Overthinking tentang dia? Mute/unfollow itu self-care, bukan jahat.",
                "Pengen tau dia gimana sekarang? Biarin aja, fokus pada diri sendiri.",
                "Khawatir dia udah move on? Biarin. Kamu juga bisa, dan bahkan lebih baik!",
                "Galau lihat dia sama orang lain? That's not your concern anymore, accept it.",
            ],
            "acceptance": [
                "Bagus! Kamu udah bisa memikirkan dia tapi tetap kuat. That's growth!",
                "Itu normal untuk miss memories, tapi jangan untuk miss dia. Bedain yuk.",
                "Ingat, nostalgia itu ilusi. Kamu lebih baik sekarang!",
                "Miss dia? Okay. Tapi jangan sampe jadi alasan balik. Kamu lebih worth it!",
            ]
        },
        
        # Red flags / toxic behavior
        "red_flags": {
            "anger": [
                "Toxic behavior? YES, kamu boleh marah! Tapi jangan lakukan balas dendam.",
                "Red flag itu alasan untuk away, bukan untuk dendam. Stay smart, okay?",
                "Kesal dengan behavior dia? Valid banget. Tapi gunakan amarah jadi strength.",
                "Dia toxic? Good riddance. Jangan sampai buat kamu jadi toxic juga.",
            ],
            "anxiety": [
                "Overthinking tentang red flag? Here's the thing: trust your gut, itu important.",
                "Bingung ini red flag apa nggak? When in doubt, it's usually a red flag.",
                "Worried kalau kamu too harsh in judging? Gpp, self-protection is valid.",
                "Gelisah dengan toxic behavior? Boleh kok nggak accept itu. Cut it off.",
            ],
            "acceptance": [
                "Bagus! Bisa lihat red flag itu artinya kamu growing! Self-aware banget!",
                "YES! Recognize yang toxic dan stay away. Kamu deserve better!",
                "Lanjut maintain boundary itu, kamu kuat kok!",
                "Proud kamu bisa recognize ini. That's wisdom talking!",
            ]
        },
        
        # Self-care & healing
        "self_care": {
            "anger": [
                "Channel energi marah kamu jadi aktivitas positif! That's productive!",
                "Gym, olahraga keras, aktivitas yang challenging? Perfect outlet untuk emosi!",
                "Gunakan amarah jadi motivasi buat jadi versi terbaik diri kamu!",
                "Self-care yang active cocok buat kamu sekarang. Lakukan yuk!",
            ],
            "anxiety": [
                "Bikin routine jelas bisa bantu reduce anxiety kamu. Coba yuk!",
                "Overthinking tentang kesalahan sendiri? Self-compassion itu key.",
                "Worried kalau self-care itu selfish? No, it's necessary. Do it anyway.",
                "Galau sama hobby yang bikin forget about dia? DO IT. That's healthy!",
            ],
            "acceptance": [
                "YES! Self-care itu self-love! Lanjutin maintain momentum healing-mu!",
                "Bagus banget! Me time sama healing adalah investasi terbaik, percaya diri terus!",
                "Kamu priority number 1 sekarang! Keep it up!",
                "Ini yang namanya true strength. Jaga diri sendiri terus ya!",
            ]
        },
        
        # Moving on / future
        "future": {
            "anger": [
                "Channel energi ini jadi ambisi! Tunjukin dia kamu bisa lebih sukses tanpanya!",
                "Masa depan bright banget untuk kamu! Lebih bright dari hubungan yang toxic!",
                "Focus pada impian, bukan pada dendam. Itu yang lebih produktif!",
                "Best revenge adalah living your best life. Focus itu!",
            ],
            "anxiety": [
                "Overthinking masa depan? Stop. Take one day at a time.",
                "Worried tentang being alone forever? That's not realistic. You'll be okay.",
                "Bingung gimana bisa bahagia tanpa dia? You'll figure it out. Give time.",
                "Galau sama unknown future? Embrace the uncertainty, that's where growth is.",
            ],
            "acceptance": [
                "Wah ini yang namanya progress! Future kelihatan bright untuk kamu!",
                "YES! Exciting untuk masa depan tanpa dia! That's the spirit!",
                "Lanjut fokus pada impian kamu. Dia already in the past.",
                "Bagus! Kamu udah ngeliat hidup beyond the relationship. Keep going!",
            ]
        },
        
        # Default responses
        "default": {
            "anger": [
                "Aku mengerti kemarahan kamu. Mari kita cari jalan yang positif. Ada lagi?",
                "Emosi kamu valid. Tapi mari kita manage dengan baik. Apa lagi?",
                "Gpp marah, tapi jangan buat keputusan gegabuan. Apa lagi yang ingin dibahas?",
                "Amarah itu temporary. Mari kita fokus pada solusi jangka panjang.",
            ],
            "anxiety": [
                "Aku paham kekhawatiranmu. Kita break it down bareng, oke?",
                "Jangan khawatir sendirian. Cerita lebih banyak?",
                "Overthinking itu normal. Mari kita cariin clarity.",
                "Galau ya? Ayo kita untangle ini confusion.",
            ],
            "acceptance": [
                "Semangat healing-mu tulus banget! Ada yang lain yang bisa aku bantu?",
                "Energi positif kamu infectious! Lanjutkan terus!",
                "Aku suka ini! Apa lagi yang ingin kita bahas?",
                "Kamu doing great! Cerita lagi yuk!",
            ]
        }
    }
    
    @staticmethod
    def process_message(message: str) -> Dict:
        """
        Process user message dan generate response
        Return: {response, emotion, intent, confidence}
        """
        # Detect emotion
        emotion, confidence = EmotionDetector.detect(message)
        
        # Detect intent
        intent = ChatbotEngine._detect_intent(message)
        
        # Get response berdasarkan emotion dan intent
        response = ChatbotEngine._get_response(emotion, intent)
        
        return {
            "response": response,
            "emotion": emotion,
            "confidence": confidence,
            "intent": intent
        }
    
    @staticmethod
    def _detect_intent(message: str) -> str:
        """Detect intent dari message - Breakup focused"""
        message_lower = message.lower()
        
        # Breakup / heartbreak related
        breakup_words = ["putus", "putus cinta", "patah hati", "sakit hati", 
                        "dia pergi", "dia tinggal", "we broke up", "breakup",
                        "relationship", "hubungan", "pacar"]
        if any(word in message_lower for word in breakup_words):
            return "breakup"
        
        # Missing ex
        missing_words = ["miss", "kangen", "follow", "lihat story", "cek",
                        "gimana dia", "dia apa", "dia sama siapa", "bagaimana dia"]
        if any(word in message_lower for word in missing_words):
            return "missing_ex"
        
        # Red flags
        red_flag_words = ["toxic", "merah", "flag", "salah", "pelit", "jahat",
                         "kasar", "curang", "selingkuh", "bohong", "manipulate"]
        if any(word in message_lower for word in red_flag_words):
            return "red_flags"
        
        # Self-care
        selfcare_words = ["self-care", "sendiri", "hobby", "main", "jalan",
                         "tidur", "makan", "spa", "treat myself", "me time"]
        if any(word in message_lower for word in selfcare_words):
            return "self_care"
        
        # Future
        future_words = ["masa depan", "future", "nanti", "besok", "impian",
                       "tujuan", "goal", "career", "fokus", "move on", "maju"]
        if any(word in message_lower for word in future_words):
            return "future"
        
        # Asking help
        help_words = ["bantu", "help", "gimana", "bagaimana", "how", "apa yang harus"]
        if any(word in message_lower for word in help_words):
            return "asking_help"
        
        # Greeting
        greeting_words = ["halo", "hello", "pagi", "salam", "hey", "hi", "apa kabar"]
        if any(word in message_lower for word in greeting_words):
            return "greeting"
        
        return "default"
    
    @staticmethod
    def _get_response(emotion: str, intent: str) -> str:
        """Get response template"""
        if intent in ChatbotEngine.RESPONSES:
            responses = ChatbotEngine.RESPONSES[intent].get(
                emotion, 
                ChatbotEngine.RESPONSES[intent]["anxiety"]  # Default to anxiety
            )
        else:
            responses = ChatbotEngine.RESPONSES["default"].get(
                emotion,
                ChatbotEngine.RESPONSES["default"]["anxiety"]
            )
        
        return random.choice(responses)