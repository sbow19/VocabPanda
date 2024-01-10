module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin',
              [
                'module-resolver',
                {
                  root: ['./src'],
                  extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
                  alias: {
                    tests: ['./tests/'],
                    "@shared": "./src/app/shared",
                    "@screens": "./src/app/screens",
                    "@customTypes": "./src/app/types",
                    "@styles": "./src/app/shared_styles",
                    "@game": "./src/app/game",
                    "@database": ".src/app/database",
                    "@context": "./src/app/context",
                    "@api": "./src/app/api",
                    "@routes": "./src/app/routes"
                  },
                },
                
              ]
            ]
};
