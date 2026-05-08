// components/QuestionTypes/index.js — Plugin registry of all question type renderers
import { ShortAnswerEditor, ShortAnswerPreview } from './ShortAnswerEditor.jsx';
import { LongAnswerEditor, LongAnswerPreview } from './LongAnswerEditor.jsx';
import { TrueFalseEditor, TrueFalsePreview } from './TrueFalseEditor.jsx';
import { MultipleChoiceEditor, MultipleChoicePreview } from './MultipleChoiceEditor.jsx';
import { CheckboxEditor, CheckboxPreview } from './CheckboxEditor.jsx';
import { DropdownEditor, DropdownPreview } from './DropdownEditor.jsx';
import { NumberEditor, NumberPreview } from './NumberEditor.jsx';
import { DateEditor, DatePreview } from './DateEditor.jsx';
import { EmailEditor, EmailPreview } from './EmailEditor.jsx';
import { PhoneEditor, PhonePreview } from './PhoneEditor.jsx';
import { FileUploadEditor, FileUploadPreview } from './FileUploadEditor.jsx';
import { RatingEditor, RatingPreview } from './RatingEditor.jsx';
import { SectionHeaderEditor, SectionHeaderPreview } from './SectionHeaderEditor.jsx';

export const questionTypeRegistry = {
  short_answer:    { editor: ShortAnswerEditor,    previewRenderer: ShortAnswerPreview },
  long_answer:     { editor: LongAnswerEditor,     previewRenderer: LongAnswerPreview },
  true_false:      { editor: TrueFalseEditor,      previewRenderer: TrueFalsePreview },
  multiple_choice: { editor: MultipleChoiceEditor, previewRenderer: MultipleChoicePreview },
  checkbox:        { editor: CheckboxEditor,       previewRenderer: CheckboxPreview },
  dropdown:        { editor: DropdownEditor,       previewRenderer: DropdownPreview },
  number:          { editor: NumberEditor,         previewRenderer: NumberPreview },
  date:            { editor: DateEditor,           previewRenderer: DatePreview },
  email:           { editor: EmailEditor,          previewRenderer: EmailPreview },
  phone:           { editor: PhoneEditor,          previewRenderer: PhonePreview },
  file_upload:     { editor: FileUploadEditor,     previewRenderer: FileUploadPreview },
  rating:          { editor: RatingEditor,         previewRenderer: RatingPreview },
  section_header:  { editor: SectionHeaderEditor,  previewRenderer: SectionHeaderPreview },
};

export function canHaveChildren(type) {
  return ['true_false', 'multiple_choice', 'checkbox', 'dropdown',
          'short_answer', 'long_answer', 'number', 'rating'].includes(type);
}
