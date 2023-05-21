import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchQuestionsDetails, resetCourseInfo} from '../context/questionDetailsSlice';
import SafeViewAndroid from '../components/SafeViewAndroid';
import {AntDesign, FontAwesome5} from '@expo/vector-icons';
import {Dropdown} from 'react-native-element-dropdown';
import RadioForm from 'react-native-simple-radio-button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';

const Home = () => {
    const dispatch = useDispatch();
    const {course, questions, status, error} = useSelector(state => state.questions);
    const authToken = useSelector((state) => state.auth.authToken);
    const studentInfo = useSelector((state)=> state.auth.studentInfo);
    const [lecture, setLecture] = useState(null);
    const [module, setModule] = useState(null);
    const [comment, setComment] = useState('');
    const [rates, setRates] = useState(0);
    const [isFocus, setIsFocus] = useState(false);
    const [items, setItems] = useState([]);
    const studentId = localStorage.getItem('student_id');

    useEffect(() => {
        dispatch(fetchQuestionsDetails());
    }, [dispatch]);

    console.log(studentId)
    console.log(studentInfo)

    const lectures = [];

    if (course.modules) {
        course.modules.forEach(m => {
            lectures.push({
                label: m.lectures[0].users.name,
                value: m.lectures[0].users.id,
            });
        });
    }

    const map = new Map();
    for (const lect of lectures) {
        map.set(lect['value'], lect);
    }
    const iteratorValues = map.values();
    const lectures_options = [...iteratorValues];

    const module_options = [];

    const radio_props = [];

    const static_qn_options = [
        {label: 'Poor (4 Points)', value: 4},
        {label: 'Moderate (6 Points)', value: 6},
        {label: 'Very good (10 Points)', value: 10},
    ];

    const setAnswer = (question_id, answer_id) => {
        setItems(prev => [...prev, {question_id, answer_id}]);
    };

    const submitAnswer = async () => {
        if (lecture && module) {
            const answer = {
                student_id: studentInfo.id,
                lecture_id: lecture,
                module_id: module,
                rates,
                name: comment,
                items,
            };

            await axios
                .post(
                    'http://192.168.10.32:8001/api/comment/comments',
                    {...answer},
                    {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                )
                .then(function (response) {
                    alert('Evaluation sent successfully.');
                    setLecture(null);
                    setModule(null);
                    setComment('');
                    setItems([]);
                    setRates(0);
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response.data);
                    } else if (error.request) {
                        console.log(error.request);
                    } else {
                        console.log('Error', error.message);
                    }
                });
        }
    };

    if (status === 'loading') {
        return <Text>Loading...</Text>;
    }

    if (status === 'failed') {
        return <Text>Error: {error}</Text>;
    }

    return (
        <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
            <KeyboardAwareScrollView>
                <View className="p-4 bg-slate-100">
                    <View className="mt-1 flex-row justify-between">
                        <View className="flex-row gap-2 items-center justify-center">
                            <FontAwesome5 name="user-circle" size={42} color="#007fff"/>
                            <View>
                                <Text className="font-semibold">Welcome Back,</Text>
                                <Text className="font-bold text-xl text-blue-500">issa</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className="h-10 px-5 m-2 rounded-md flex flex-row justify-center items-center border border-blue-500"
                            onPress={() => logout()}
                        >
                            <Text className="font-bold">Logout</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="p-3 mt-7 rounded-md border border-blue-500">
                        <View>
                            <Text className="text-md font-semibold text-blue-500"></Text>
                            <Text className="text-md font-semibold text-blue-500"></Text>
                        </View>
                    </View>
                    <View className="border-t border-blue-500 mt-5"></View>
                    <View className="flex gap-2 mt-5">
                        <Text className="font-semibold mb-2">
                            Please choose the Lecturer and module below to start your evaluation,
                        </Text>
                        <Dropdown
                            style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={lectures_options}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? 'Select lecturer' : '...'}
                            searchPlaceholder="Search..."
                            value={lecture}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                setLecture(item.value);
                                setIsFocus(false);
                            }}
                            renderLeftIcon={() => (
                                <AntDesign
                                    style={styles.icon}
                                    color={isFocus ? 'blue' : 'black'}
                                    name="user"
                                    size={20}
                                />
                            )}
                        />
                        <Dropdown
                            style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={module_options}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? 'Select module' : '...'}
                            searchPlaceholder="Search..."
                            value={module}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                setModule(item.value);
                                setIsFocus(false);
                            }}
                            renderLeftIcon={() => (
                                <AntDesign
                                    style={styles.icon}
                                    color={isFocus ? 'blue' : 'black'}
                                    name="Safety"
                                    size={20}
                                />
                            )}
                        />
                    </View>
                    <View className="mt-5 flex-col">
                        <View className="flex-row justify-between">
                            <Text className="font-semibold">Please rate the lecture:</Text>
                            <RadioForm
                                radio_props={static_qn_options}
                                initial={0}
                                onPress={value => {
                                    setRates(value);
                                }}
                                buttonSize={10}
                            />
                        </View>
                    </View>
                    <View className="mt-5">
                        {questions.map(question => (
                            <View key={question.id} className="mt-2">
                                <Text className="font-semibold">{question.name}</Text>
                                <RadioForm
                                    radio_props={question.answers.map(answer => ({
                                        label: answer.name,
                                        value: answer.id,
                                    }))}
                                    initial={0}
                                    onPress={value => setAnswer(question.id, value)}
                                    buttonSize={10}
                                />
                            </View>
                        ))}
                    </View>
                    <View className="mt-5">
                        <Text className="font-semibold">Comments:</Text>
                        <TextInput
                            className="mt-2 p-2 border-2 rounded-lg"
                            placeholder="Type your comment here..."
                            value={comment}
                            onChangeText={text => setComment(text)}
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                    <View className="flex-row justify-center mt-5">
                        <TouchableOpacity
                            className="h-10 px-5 m-2 rounded-md flex flex-row justify-center items-center border border-blue-500"
                            onPress={submitAnswer}
                        >
                            <Text className="font-bold">Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="h-10 px-5 m-2 rounded-md flex flex-row justify-center items-center border border-blue-500"
                            onPress={() => dispatch(resetCourseInfo())}
                        >
                            <Text className="font-bold">Reset</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        width: 200,
    },
    placeholderStyle: {
        color: '#9EA0A4',
        fontWeight: 'bold',
    },
    selectedTextStyle: {
        color: 'black',
        fontWeight: 'bold',
    },
    inputSearchStyle: {
        borderBottomColor: 'blue',
        borderBottomWidth: 1,
        padding: 5,
    },
    iconStyle: {
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
});

export default Home;
