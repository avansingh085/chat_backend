#include <bits/stdc++.h>
using namespace std;

int main() {
	int n;
	cin>>n;
	vector<vector<char>>s(n,vector<char>(n,'A'));
	for(int i=0;i<n;i++)
	{
	    for(int j=0;j<n;j++)
	    {
	    cin>>s[i][j];
	    }
	}
	int q;
	cin>>q;
	while(q--)
	{
	    int r,c,k;
	    cin>>r>>c>>k;
	    int cnt=0;
	    while(k>1)
	    {
	    vector<vector<int>>v;
	    cnt++;
	    for(int i=c;i<(c+k);i++)
	    {
	        v.push_back({r,i,s[r][i]-'A'});
	    }
	    
	     for(int i=r+1;i<(r+k);i++)
	    {
	        v.push_back({i,c+k-1,s[i][c+k-1]-'A'});
	    }
	    for(int i=c+k-2;i>=c;i--)
	    {
	        v.push_back({r+k-1,i,s[r+k-1][i]-'A'});
	    }
	    for(int i=r+k-2;i>r;i--)
	    {
	        v.push_back({i,c,s[i][c]-'A'});
	    }
	   // cout<<v.size()<<endl;
	   int sz=v.size();
	    for(int i=0;i<sz;i++)
         {
             if(cnt%2)
             {
             int num=v[(i+cnt)%sz][2];
             num--;
             if(num<0)
             num=25;
             s[v[i][0]][v[i][1]]=(char)('A'+num);
             }
             else
             {
                  int num=v[(i-cnt+sz)%sz][2];
             num++;
             num=num%26;
             s[v[i][0]][v[i][1]]=(char)('A'+num);
             }
             //cout<<v[i][0]<<" "<<v[i][1]<<" "<<v[i][2]<<endl;
         }
         k-=2;
         r++;
         c++;
	    }
//          for(auto i : s)
// 	{
// 	    for(auto j : i)
// 	   {
// 	        cout<<j<<"  ";
// 	    }
// 	    cout<<endl;
// 	} 
	}
	for(auto i : s)
	{
	    for(auto j : i)
	   {
	        cout<<j<<"";
	    }
	}
	return 0;

}
