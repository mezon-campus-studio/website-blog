"use client";

import styles from "./SearchInput.module.css";
import React from "react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchInput: React.FC<SearchInputProps> = ({ ...props }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>🔍</span>
      <input
        type="text"
        className={styles.input}
        placeholder="Search insights..."
        {...props}
      />
    </div>
  );
};