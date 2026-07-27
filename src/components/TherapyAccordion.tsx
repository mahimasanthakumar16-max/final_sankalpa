"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface TherapyType {
    id: string;
    title: string;
    description: string;
    fullContent: string;
}

const therapyTypes: TherapyType[] = [
    {
        id: 'act',
        title: 'Acceptance and Commitment Therapy (ACT)',
        description: 'A mindfulness-based approach that helps you accept difficult thoughts and feelings while committing to meaningful action.',
        fullContent: 'ACT helps you develop psychological flexibility by accepting thoughts and feelings that are out of your control, while focusing on living according to your values. This approach is particularly effective for anxiety, depression, chronic pain, and life transitions.'
    },
    {
        id: 'emdr',
        title: 'Eye Movement Desensitization and Reprocessing (EMDR)',
        description: 'A powerful trauma therapy that processes painful memories and reduces their emotional charge.',
        fullContent: 'EMDR uses bilateral stimulation (eye movements, taps, or sounds) to help your brain process traumatic memories in a safe way. This evidence-based therapy is highly effective for post-traumatic stress disorder (PTSD), anxiety, and trauma recovery.'
    },
    {
        id: 'gottman',
        title: 'Gottman Method Couples Therapy',
        description: 'Research-backed couples work focused on building intimacy, friendship, and conflict resolution.',
        fullContent: 'The Gottman Method uses scientific research on healthy relationships to help couples improve communication, understand each other better, and navigate conflict with compassion. This approach is effective for strengthening relationships and addressing common relationship challenges.'
    },
    {
        id: 'eft',
        title: 'Emotionally Focused Therapy (EFT)',
        description: 'A couples therapy that creates secure emotional bonds and deeper connection between partners.',
        fullContent: 'EFT helps couples understand and shift unhelpful emotional patterns, creating a more secure attachment. This evidence-based approach is excellent for improving intimacy, resolving conflicts, and building stronger emotional connections.'
    },
    {
        id: 'narrative',
        title: 'Narrative Therapy',
        description: 'A collaborative approach that helps you reauthor your life story and reclaim your agency.',
        fullContent: 'Narrative therapy views your life as an ongoing story that you have the power to shape. This approach helps you separate yourself from problems, identify your unique strengths, and create new, more empowering narratives about your life and identity.'
    },
    {
        id: 'tfcbt',
        title: 'Trauma-Focused Cognitive Behavioral Therapy (TF-CBT)',
        description: 'A structured, evidence-based treatment for trauma that combines cognitive and behavioral techniques.',
        fullContent: 'TF-CBT combines cognitive therapy, exposure therapy, and coping skills to help you process trauma in a safe way. This approach has strong research support for treating post-traumatic stress disorder (PTSD), childhood trauma, and complex grief.'
    },
    {
        id: 'rct',
        title: 'Relational-Cultural Therapy (RCT)',
        description: 'An approach that emphasizes connection, cultural context, and relational growth.',
        fullContent: 'RCT recognizes that growth happens through connection and relationships. This approach is grounded in cultural awareness and helps you develop authentic, empowering relationships while honoring your unique cultural context and identity.'
    }
];

export default function TherapyAccordion() {
    const [openId, setOpenId] = useState<string | null>(null);

    return (
        <div className="therapy-accordion-wrapper">
            <div className="accordion-container">
                {therapyTypes.map((therapy, index) => (
                    <div key={therapy.id} className="accordion-item">
                        <button
                            className="accordion-trigger"
                            onClick={() => setOpenId(openId === therapy.id ? null : therapy.id)}
                            aria-expanded={openId === therapy.id}
                        >
                            <div className="accordion-trigger-content">
                                <span className="accordion-number">{String(index + 1).padStart(2, '0')}</span>
                                <div className="accordion-text">
                                    <h4 className="accordion-title">{therapy.title}</h4>
                                    <p className="accordion-description">{therapy.description}</p>
                                </div>
                            </div>
                            <ChevronDown
                                size={24}
                                className={`accordion-chevron ${openId === therapy.id ? 'open' : ''}`}
                            />
                        </button>

                        {openId === therapy.id && (
                            <div className="accordion-content">
                                <p className="accordion-full-content">{therapy.fullContent}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
