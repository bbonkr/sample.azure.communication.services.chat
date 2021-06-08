import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
interface UserSearchFormProps {
    isLoading?: boolean;
    onSearch?: (keyword: string) => void;
}

export const UserSearchForm = ({
    isLoading,
    onSearch,
}: UserSearchFormProps) => {
    const [keyword, setKeyword] = useState('');

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();

        const value = event.currentTarget.value;
        setKeyword((_) => value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (onSearch) {
            onSearch(keyword);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="field has-addons">
                <div className="control is-expanded">
                    <input
                        type="search"
                        name="keyword"
                        className="input"
                        placeholder="Search user"
                        value={keyword}
                        onChange={handleChangeInput}
                    />
                </div>
                <div className="control">
                    <button className="button" disabled={isLoading}>
                        <FaSearch />
                    </button>
                </div>
            </div>
        </form>
    );
};
