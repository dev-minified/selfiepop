export interface ILinkEditorProps {
  onCancel?: Function;
  value?: any;
  onSubmit?: Function;
  title?: string;
  options?: { status?: boolean; delete?: boolean; close?: boolean };
  socialLinks?: SocialLink[];
  onDeleteClick?(): void;
}
