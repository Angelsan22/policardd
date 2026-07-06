/* Campo de texto etiquetado, reutilizable en formularios */
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/colors';

export const Input = ({ etiqueta, valor, onChangeText, placeholder, secureTextEntry, keyboardType, error }) => {
  return (
    <View style={styles.grupo}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={valor}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.slate}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || 'default'}
        autoCapitalize="none"
      />
      {error ? <Text style={styles.textoError}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  grupo: {
    marginBottom: 14,
    width: '100%',
  },
  etiqueta: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.dark,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.silver,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.dark,
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderColor: COLORS.dark,
    borderWidth: 2,
  },
  textoError: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.dark,
    marginTop: 4,
  },
});
