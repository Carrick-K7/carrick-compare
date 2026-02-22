import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    postcssPresetEnv({
      browsers: ['last 2 versions', 'Safari >= 14', 'iOS >= 14'],
      features: {
        'oklab-function': { 'preserve': true },
        'color-function': { 'preserve': true },
        'cascade-layers': true,
      },
    }),
    autoprefixer,
  ],
};
