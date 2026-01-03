'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
} from '@mui/material';
import { FilterAlt, RestartAlt } from '@mui/icons-material';
import { useFilters } from '@/contexts/FilterContext';
import type { Region, Category, Gender } from '@/types/purchase';

const REGIONS: Region[] = ['関東', '関西', '中部', '九州'];
const CATEGORIES: Category[] = ['スポーツ', '家電', '食品', 'ファッション', '書籍'];
const GENDERS: Gender[] = ['男性', '女性'];

export function FilterPanel() {
  const { filters, setFilters, resetFilters } = useFilters();

  const handleRegionChange = (region: Region) => {
    setFilters((prev) => ({
      ...prev,
      地域: prev.地域.includes(region)
        ? prev.地域.filter((r) => r !== region)
        : [...prev.地域, region],
    }));
  };

  const handleCategoryChange = (category: Category) => {
    setFilters((prev) => ({
      ...prev,
      購入カテゴリー: prev.購入カテゴリー.includes(category)
        ? prev.購入カテゴリー.filter((c) => c !== category)
        : [...prev.購入カテゴリー, category],
    }));
  };

  const handleGenderChange = (gender: Gender) => {
    setFilters((prev) => ({
      ...prev,
      性別: prev.性別.includes(gender)
        ? prev.性別.filter((g) => g !== gender)
        : [...prev.性別, gender],
    }));
  };

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterAlt sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2">
          フィルター
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          地域
        </Typography>
        <FormGroup>
          {REGIONS.map((region) => (
            <FormControlLabel
              key={region}
              control={
                <Checkbox
                  checked={filters.地域.includes(region)}
                  onChange={() => handleRegionChange(region)}
                />
              }
              label={region}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          カテゴリー
        </Typography>
        <FormGroup>
          {CATEGORIES.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={filters.購入カテゴリー.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
              }
              label={category}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          性別
        </Typography>
        <FormGroup>
          {GENDERS.map((gender) => (
            <FormControlLabel
              key={gender}
              control={
                <Checkbox
                  checked={filters.性別.includes(gender)}
                  onChange={() => handleGenderChange(gender)}
                />
              }
              label={gender}
            />
          ))}
        </FormGroup>
      </Box>

      <Button
        variant="outlined"
        fullWidth
        startIcon={<RestartAlt />}
        onClick={resetFilters}
      >
        フィルターをリセット
      </Button>
    </Paper>
  );
}
