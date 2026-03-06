-- This script fixes the corrupted newline characters in the cases table.
-- It replaces the literal string '\n' with a proper newline character.

UPDATE cases
SET 
    description = REPLACE(description, '\n', E'\n'),
    coping_methods = REPLACE(coping_methods, '\n', E'\n'),
    legal_provisions = REPLACE(legal_provisions, '\n', E'\n');
