'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Chip, Stack, Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';

interface TagFilterProps {
  tags: { name: string; count: number }[];
  selectedTag?: string | null;
}

export function TagFilter({ tags, selectedTag: initialSelectedTag }: TagFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState<string | null>(initialSelectedTag || null);

  useEffect(() => {
    // Update selected tag when URL changes
    const tag = searchParams.get('tag');
    setSelectedTag(tag);
  }, [searchParams]);

  const handleTagClick = (tagName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedTag === tagName) {
      // If clicking the same tag, remove the filter
      params.delete('tag');
      setSelectedTag(null);
    } else {
      // Otherwise, set the new tag filter
      params.set('tag', tagName);
      setSelectedTag(tagName);
    }

    // Update the URL without page reload
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tag');
    setSelectedTag(null);
    router.push(pathname, { scroll: false });
  };

  return (
    <Box mb={4}>
      <Typography variant="h6" component="h2" gutterBottom>
        Filter by Tags
      </Typography>
      
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
        {selectedTag && (
          <Chip
            label="Clear all"
            onClick={handleClearAll}
            variant="outlined"
            size="small"
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
              },
            }}
          />
        )}
        
        {tags.map((tag) => (
          <Chip
            key={tag.name}
            label={`${tag.name} (${tag.count})`}
            onClick={() => handleTagClick(tag.name)}
            variant={selectedTag === tag.name ? 'filled' : 'outlined'}
            color="primary"
            size="small"
            sx={{
              '&.MuiChip-filled': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
              },
              '&.MuiChip-outlined': {
                borderColor: 'primary.light',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
