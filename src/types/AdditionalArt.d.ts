type AdditionalArtProps = {
  title?: string;
  description?: string;
  additionalArt: IAdditionalArt[];
  popId?: string;
  onDelete?: (id: number) => void;
  updatePromotionMediaUsingReference?: (arts: IAdditionalArt[]) => void;
};
type IAdditionalArt = {
  artPath: string;
  artType: string;
  artName?: string;
  isActive?: boolean;
  _id?: string;
};
