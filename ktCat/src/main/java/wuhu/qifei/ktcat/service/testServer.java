package wuhu.qifei.ktcat.service;

import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;

public class testServer {
    public static void main(String[] args) {
        ArrayList<Person> people = new ArrayList<>();
        Person person = new Person("1", "haha");
        Person person1 = new Person("2", "haha");
        Person person2 = new Person("3", null);
        people.add(person);
        people.add(person1);
        people.add(person2);

        Map<String, String> collect = people.stream().collect(Collectors.toMap(Person::getId, Person::getName));
        System.out.println(collect.get("1"));
        System.out.println(collect.get("2"));
        System.out.println(collect.get("3"));

    }
}
