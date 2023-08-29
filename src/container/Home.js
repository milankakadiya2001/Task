import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FlipCard from 'react-native-flip-card';

// local imports
import CSafeAreaView from '../components/common/CSafeAreaView';
import CText from '../components/common/CText';
import CButton from '../components/common/CButton';
import {colors, styles} from '../themes';
import {moderateScale} from '../common/constants';
import strings from '../i18n/strings';

const generateRandomNumbers = count => {
  const numbers = [];
  while (numbers.length < count) {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }
  return numbers;
};

export default function Home() {
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [headerNumber, setHeaderNumber] = useState(null);
  const [remainingFlips, setRemainingFlips] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [guess, setGuess] = useState(null);
  const [flipCount, setFlipCount] = useState(0);
  const [flippedCards, setFlippedCards] = useState([]);
  const [disableFlips, setDisableFlips] = useState(false);

  useEffect(() => {
    randomFlipNumbers();
  }, []);

  const randomFlipNumbers = () => {
    const numbers = generateRandomNumbers(30);
    setRandomNumbers(numbers);
    const randomIndex = Math.floor(Math.random() * 30);
    setHeaderNumber(numbers[randomIndex]);
  };

  const resetButton = () => {
    randomFlipNumbers();
    setRemainingFlips(20);
    setFlipCount(0);
    setFlippedCards([]);
    setGameOver(false);
    setGuess(null);
    setDisableFlips(false);
  };

  const handleCardFlip = item => {
    if (!flippedCards.includes(item)) {
      setFlipCount(flipCount + 1);
      setFlippedCards([...flippedCards, item]);
    }
    if (flipCount === 20) {
      setGameOver(true);
      setDisableFlips(true);
    }
    if (item === headerNumber) {
      setGuess(item);
      setGameOver(true);
      setDisableFlips(true);
    }
  };

  const renderItem = ({item}) => {
    return (
      <FlipCard
        key={item}
        style={localStyles.card}
        friction={6}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
        clickable={disableFlips}>
        <TouchableOpacity
          style={localStyles.cardInner}
          disabled={disableFlips}
          onPress={() => handleCardFlip(item)}>
          <CText type={flippedCards.includes(item) ? 'm18' : 'B20'}>
            {flippedCards.includes(item) ? item : '!'}
          </CText>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={true}
          style={localStyles.cardInner}
          onPress={() => handleCardFlip(item)}>
          <CText type={'m18'}>!</CText>
        </TouchableOpacity>
      </FlipCard>
    );
  };

  const renderHeaderComponent = () => {
    return (
      <View style={styles.selfCenter}>
        <CText
          type={'b22'}
          align={'center'}
          color={colors.black}
          style={localStyles.header}>
          {strings.guessNumberGame}
        </CText>
        <CText
          type={'r18'}
          align={'center'}
          color={colors.black}
          style={localStyles.targetNumber}>
          {strings.targetNumber + headerNumber}
        </CText>
        {gameOver ? (
          <CText
            type={'r18'}
            align={'center'}
            color={colors.black}
            style={localStyles.result}>
            {guess === headerNumber
              ? strings.congratulationsDesc + guess
              : strings.gameOverDesc}
          </CText>
        ) : null}
      </View>
    );
  };

  const renderFooterComponent = () => {
    return (
      <View>
        <CText
          type={'r16'}
          align={'center'}
          color={colors.black}
          style={localStyles.remainingFlips}>
          {strings.remainingFlips + remainingFlips}
        </CText>
        <CText
          type={'r16'}
          align={'center'}
          color={colors.black}
          style={localStyles.remainingFlips}>
          {strings.flips + flipCount}
        </CText>
        <CButton
          type={'M16'}
          title={strings.resetGame}
          onPress={resetButton}
          containerStyle={localStyles.resetButton}
        />
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <FlatList
        data={randomNumbers}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={5}
        ListHeaderComponent={renderHeaderComponent}
        ListFooterComponent={renderFooterComponent}
        columnWrapperStyle={styles.justifyCenter}
        contentContainerStyle={localStyles.cardContainer}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  header: {
    ...styles.mv15,
  },
  targetNumber: {
    ...styles.mb15,
  },
  cardContainer: {
    ...styles.ph20,
  },
  card: {
    width: moderateScale(50),
    height: moderateScale(50),
    margin: moderateScale(5),
    borderRadius: moderateScale(10),
    ...styles.center,
    backgroundColor: colors.lightGray,
  },
  cardInner: {
    ...styles.flex,
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(10),
    ...styles.center,
  },
  remainingFlips: {
    ...styles.mt10,
  },
  result: {
    ...styles.mb20,
    fontWeight: 'bold',
  },
  resetButton: {
    ...styles.mv20,
    width: '50%',
    ...styles.selfCenter,
  },
});
