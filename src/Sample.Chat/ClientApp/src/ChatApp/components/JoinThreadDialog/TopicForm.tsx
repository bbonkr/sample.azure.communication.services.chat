import React, { useEffect, useState } from 'react';

interface TopicFormProps {
    onChange?: (topic: string) => void;
}

export const TopicForm = ({ onChange }: TopicFormProps) => {
    const [topic, setTopic] = useState('');

    const handleChangeTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;

        setTopic((_) => value);
    };

    useEffect(() => {
        if (onChange) {
            onChange(topic);
        }
    }, [topic]);

    return (
        <div className="field">
            <div className="control">
                <input
                    type="text"
                    className="input"
                    name="topic"
                    value={topic}
                    placeholder="Thread topic"
                    onChange={handleChangeTopic}
                />
            </div>
        </div>
    );
};
