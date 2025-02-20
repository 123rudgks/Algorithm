// 도시와 경로를 위한 인터페이스 정의
interface City {
    name: string;
    routes: Map<City, number>;
  }
  
  // 우선순위 큐를 위한 노드 인터페이스
  interface PriorityQueueNode {
    city: City;
    priority: number;
  }
  
  // 우선순위 큐 클래스
  class PriorityQueue {
    private values: PriorityQueueNode[] = [];
  
    // 뒤에서 추가
    enqueue(city: City, priority: number): void {
      this.values.push({ city, priority });
      this.sort();
    }
    // 앞에서 pop
    dequeue(): PriorityQueueNode | undefined {
      return this.values.shift();
    }
  
    // O(nlogn)
    sort(): void {
      this.values.sort((a, b) => a.priority - b.priority);
    }
  
    isEmpty(): boolean {
      return this.values.length === 0;
    }
  }
  
  function dijkstraShortestPath(startingCity: City, finalDestination: City): string[] {
    // 최소 비용 테이블
    const cheapestPricesTable: { [key: string]: number } = {};
    // 이전 경유 도시 테이블
    const cheapestPreviousStopoverCityTable: { [key: string]: string | null } = {};
    const cheapestCityTable:{
      [key:string]:{prev?:string , price:number}
    } = {}
    // 방문한 도시 집합
    const visitedCities = new Set<string>();
    // 우선순위 큐 초기화
    const priorityQueue = new PriorityQueue();
  
    // 시작 도시 초기화
    cheapestCityTable[startingCity.name] = { price: 0}
    cheapestPricesTable[startingCity.name] = 0;
    priorityQueue.enqueue(startingCity, 0);
  
    // 모든 다른 도시의 초기 거리를 무한대로 설정
    cheapestPreviousStopoverCityTable[startingCity.name] = null;
  
    // 우선 순위 큐가 더 이상 없을 때 까지 반복
    while (!priorityQueue.isEmpty()) {
      const current = priorityQueue.dequeue();
      if (!current) break;
      
      const currentCity = current.city;
      
      // 이미 방문한 도시는 건너뛰기
      if (visitedCities.has(currentCity.name)) continue;
      
      // 현재 도시를 방문 처리
      visitedCities.add(currentCity.name);
  
      // 목적지에 도달했다면 종료
      if (currentCity === finalDestination) break;
  
      // 인접 도시들을 확인
      currentCity.routes.forEach((price, adjacentCity) => {
        if (visitedCities.has(adjacentCity.name)) return;
  
        const priceThroughCurrentCity = cheapestPricesTable[currentCity.name] + price;
  
        if (!cheapestPricesTable[adjacentCity.name] || 
            priceThroughCurrentCity < cheapestPricesTable[adjacentCity.name]) {
          cheapestPricesTable[adjacentCity.name] = priceThroughCurrentCity;
          cheapestPreviousStopoverCityTable[adjacentCity.name] = currentCity.name;
          priorityQueue.enqueue(adjacentCity, priceThroughCurrentCity);
        }
      });
    }
  
    // 최단 경로 재구성
    const shortestPath: string[] = [];
    let currentCityName: string | null = finalDestination.name;
  
    while (currentCityName) {
      shortestPath.unshift(currentCityName);
      currentCityName = cheapestPreviousStopoverCityTable[currentCityName];
    }
  
    return shortestPath;
  }
  
  export default dijkstraShortestPath;
  