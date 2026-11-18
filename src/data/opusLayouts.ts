export interface OpusLayoutItem {
  id: string;
  name: string;
  description: string;
  iconType: 'fill' | 'fit' | 'split' | 'three' | 'four' | 'screenshare' | 'gameplay';
  aspectRatios: ('9:16' | '16:9' | '1:1' | '4:5')[];
  defaultChecked?: boolean;
}

export const OPUS_LAYOUTS: OpusLayoutItem[] = [
  {
    id: 'fill',
    name: 'Fill',
    description: 'Dynamic face-tracking crop that fills the 9:16 frame.',
    iconType: 'fill',
    aspectRatios: ['9:16', '1:1', '4:5'],
    defaultChecked: true
  },
  {
    id: 'fit',
    name: 'Fit',
    description: 'Dual-layer blurred background with sharp centered video.',
    iconType: 'fit',
    aspectRatios: ['9:16', '1:1', '4:5'],
    defaultChecked: true
  },
  {
    id: 'split',
    name: 'Split',
    description: 'Stacked 2-speaker view (host top, guest bottom) for interviews & podcasts.',
    iconType: 'split',
    aspectRatios: ['9:16', '1:1'],
    defaultChecked: true
  },
  {
    id: 'three',
    name: 'Three',
    description: 'Top single speaker + bottom dual speakers for group panel discussions.',
    iconType: 'three',
    aspectRatios: ['9:16', '1:1'],
    defaultChecked: true
  },
  {
    id: 'four',
    name: 'Four',
    description: '2x2 grid tracking up to 4 simultaneous conversational participants.',
    iconType: 'four',
    aspectRatios: ['9:16', '1:1'],
    defaultChecked: true
  },
  {
    id: 'screenshare',
    name: 'ScreenShare',
    description: 'Speaker webcam PIP or header with shared presentation / code editor.',
    iconType: 'screenshare',
    aspectRatios: ['9:16', '16:9', '1:1'],
    defaultChecked: true
  },
  {
    id: 'gameplay',
    name: 'Gameplay',
    description: 'Webcam facecam stacked directly on top of intense gameplay action.',
    iconType: 'gameplay',
    aspectRatios: ['9:16'],
    defaultChecked: true
  }
];
